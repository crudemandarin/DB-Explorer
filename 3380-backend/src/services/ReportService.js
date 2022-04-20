const UserService = require('./UserService');
const SQLService = require('./SQLService');

class ReportService {
    static async getReport(userId, workspaceIds, projectIds, lowerBound, upperBound) {
        /* LOAD DATA */
        let [workspaces] = await ReportService.getWorkspaces(userId, workspaceIds);
        let [projects] = await ReportService.getProjects(userId, projectIds, workspaceIds);
        let [tasks] = await ReportService.getTasks(userId, projectIds, workspaceIds);
        const taskFields = await SQLService.getTableFields('Task');
        const requestedBy = (await SQLService.query(`SELECT * FROM User WHERE ID='${userId}'`))[0];

        /* FILTER BY DATE INTERVAL */
        if (lowerBound) {
            const lower = new Date(lowerBound);
            tasks = tasks.filter((task) => {
                const createdAt = new Date(task.CreatedAt);
                return createdAt >= lower;
            });
        }

        if (upperBound) {
            const upper = new Date(upperBound);
            tasks = tasks.filter((task) => {
                const closedAt = new Date(task.TimeClosed);
                return closedAt <= upper;
            });
        }

        /* REPLACE FKS WITH REAL VALUES */

        /* EMBED ARRAYS */
        projects = projects.map((project) => {
            const updated = { ...project };
            const tempTasks = tasks.filter((task) => task.ProjectID === project.ID);
            updated.tasks = tempTasks;
            updated.numTasks = tempTasks.length;
            return updated;
        });

        workspaces = workspaces.map((workspace) => {
            const updated = { ...workspace };
            const tempProjects = projects.filter((project) => project.WorkspaceID === workspace.ID);
            updated.projects = tempProjects;
            updated.numProjects = tempProjects.length;
            updated.numTasks = tempProjects.reduce(
                (sumTasks, project) => sumTasks + project.numTasks,
                0
            );
            return updated;
        });

        const requestedAt = Date.now();
        return { workspaces, taskFields, requestedBy, requestedAt };
    }

    static getWorkspaces(userId, workspaceIds) {
        if (!workspaceIds.length) return UserService.select(userId, 'Workspace', [], []);
        const where = [{ name: 'WorkspaceID', value: workspaceIds }];
        return UserService.select(userId, 'Workspace', [], where);
    }

    static getProjects(userId, projectIds, workspaceIds) {
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
