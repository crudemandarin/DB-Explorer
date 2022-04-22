const UserService = require('./UserService');
const SQLService = require('./SQLService');

class ReportService {
    static async getReport(userId, workspaceIds, projectIds, lowerBound, upperBound) {
        const { workspaces, projects, tasks, users, workspaceUsers, taskFields, requestedBy } =
            await ReportService.getData(userId, workspaceIds, projectIds);

        const filteredTasks = ReportService.getDateFilteredTasks(tasks, lowerBound, upperBound);

        const { updatedProjects, updatedWorkspaces } = ReportService.getFKTranslatedData(
            workspaces,
            projects,
            users,
            workspaceUsers
        );

        const { embeddedWorkspaces, numWorkspaces, numProjects, numTasks, requestedAt } =
            ReportService.getProcessedData(
                lowerBound,
                upperBound,
                updatedWorkspaces,
                updatedProjects,
                filteredTasks
            );

        return {
            workspaces: embeddedWorkspaces,
            taskFields,
            numWorkspaces,
            numProjects,
            numTasks,
            requestedBy,
            requestedAt,
        };
    }

    static async getData(userId, workspaceIds, projectIds) {
        const [workspaces] = await ReportService.getWorkspaces(userId, workspaceIds);
        const [projects] = await ReportService.getProjects(userId, projectIds, workspaceIds);
        const [tasks] = await ReportService.getTasks(userId, projectIds, workspaceIds);
        const [users] = await SQLService.select('User', [], []);
        const [workspaceUsers] = await SQLService.select('WorkspaceUser', [], []);
        const taskFields = await SQLService.getTableFields('Task');
        const requestedBy = (await SQLService.query(`SELECT * FROM User WHERE ID='${userId}'`))[0];

        return {
            workspaces,
            projects,
            tasks,
            users,
            workspaceUsers,
            taskFields,
            requestedBy,
        };
    }

    static getDateFilteredTasks(tasks, lowerBound, upperBound) {
        let filteredTasks = tasks;

        if (lowerBound) {
            const lower = new Date(lowerBound);
            filteredTasks = tasks.filter((task) => {
                const createdAt = new Date(task.CreatedAt);
                return createdAt >= lower;
            });
        }

        if (upperBound) {
            const upper = new Date(upperBound);
            filteredTasks = tasks.filter((task) => {
                const closedAt = new Date(task.TimeClosed);
                return closedAt <= upper;
            });
        }

        return filteredTasks;
    }

    static getFKTranslatedData(workspaces, projects, users, workspaceUsers) {
        const updatedProjects = projects.map((project) => {
            const updated = { ...project };
            workspaceUsers.forEach((workspaceUser) => {
                users.forEach((user) => {
                    if (
                        user.ID === workspaceUser.UserID &&
                        workspaceUser.ID === updated.CreatedBy
                    ) {
                        updated.CreatedBy = `${user.FirstName} ${user.LastName}`;
                    }
                    if (
                        user.ID === workspaceUser.UserID &&
                        workspaceUser.ID === updated.UpdatedBy
                    ) {
                        updated.UpdatedBy = `${user.FirstName} ${user.LastName}`;
                    }
                });
            });
            return updated;
        });

        const updatedWorkspaces = workspaces.map((workspace) => {
            const updated = { ...workspace };
            users.forEach((user) => {
                if (user.ID === workspace.CreatedBy) {
                    updated.CreatedBy = `${user.FirstName} ${user.LastName}`;
                }
                if (user.ID === updated.UpdatedBy) {
                    updated.UpdatedBy = `${user.FirstName} ${user.LastName}`;
                }
            });
            return updated;
        });

        return { updatedProjects, updatedWorkspaces };
    }

    static getProcessedData(
        lowerBound,
        upperBound,
        updatedWorkspaces,
        updatedProjects,
        filteredTasks
    ) {
        const lower = new Date(lowerBound);
        const upper = new Date(upperBound);

        const embeddedProjects = updatedProjects.map((project) => {
            const tempTasks = filteredTasks.filter((task) => task.ProjectID === project.ID);
            const updated = { ...project };

            updated.tasksClosed = 0;
            updated.tasksCreated = 0;
            tempTasks.forEach((task) => {
                const timeClosed = new Date(task.TimeClosed);
                const createdAt = new Date(task.CreatedAt);
                if (timeClosed >= lower && timeClosed <= upper) {
                    updated.tasksClosed += 1;
                }
                if (createdAt >= lower && createdAt <= upper) {
                    updated.tasksCreated += 1;
                }
            });
            updated.tasks = tempTasks;
            updated.numTasks = tempTasks.length;

            return updated;
        });

        const embeddedWorkspaces = updatedWorkspaces.map((workspace) => {
            const tempProjects = embeddedProjects.filter(
                (project) => project.WorkspaceID === workspace.ID
            );
            const updated = { ...workspace };

            updated.tasksClosed = 0;
            updated.tasksCreated = 0;
            embeddedProjects.forEach((project) => {
                updated.tasksClosed += project.tasksClosed;
                updated.tasksCreated += project.tasksCreated;
            });
            updated.projects = tempProjects;
            updated.numProjects = tempProjects.length;
            updated.numTasks = tempProjects.reduce(
                (sumTasks, project) => sumTasks + project.numTasks,
                0
            );

            return updated;
        });

        const numWorkspaces = updatedWorkspaces.length;
        const numProjects = updatedProjects.length;
        const numTasks = filteredTasks.length;
        const requestedAt = Date.now();

        return { embeddedWorkspaces, numWorkspaces, numProjects, numTasks, requestedAt };
    }

    static async getWorkspaces(userId, workspaceIds) {
        if (!workspaceIds.length) return UserService.select(userId, 'Workspace', [], []);
        const where = [{ name: 'ID', value: workspaceIds }];
        return UserService.select(userId, 'Workspace', [], where);
    }

    static async getProjects(userId, projectIds, workspaceIds) {
        if (projectIds.length) {
            const where = [{ name: 'ID', value: projectIds }];
            return UserService.select(userId, 'Project', [], where);
        }
        if (workspaceIds.length) {
            const where = [{ name: 'WorkspaceID', value: workspaceIds }];
            return UserService.select(userId, 'Project', [], where);
        }
        return UserService.select(userId, 'Project', [], []);
    }

    static async getTasks(userId, projectIds, workspaceIds) {
        if (projectIds.length) {
            const where = [{ name: 'ProjectID', value: projectIds }];
            return UserService.select(userId, 'Task', [], where);
        }
        if (workspaceIds.length) {
            const where = [{ name: 'WorkspaceID', value: workspaceIds }];
            return UserService.select(userId, 'Task', [], where);
        }
        return UserService.select(userId, 'Task', [], []);
    }
}

module.exports = ReportService;
