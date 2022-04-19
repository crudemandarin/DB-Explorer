const SQLService = require('./SQLService');

class ReportService {
    static async getReport(userId, workspaceIds, projectIds, date) {
        /* LOAD DATA */

        const WorkspacesSQL = ReportService.getWorkspacesSQL(workspaceIds);
        const ProjectsSQL = ReportService.getProjectsSQL(projectIds, workspaceIds);
        const TasksSQL = ReportService.getTasksSQL(projectIds, workspaceIds);

        let workspaces = await SQLService.query(WorkspacesSQL);
        let projects = await SQLService.query(ProjectsSQL);
        let tasks = await SQLService.query(TasksSQL);

        /* FILTER BY DATE INTERVAL */

        if (Object.keys(date).length) {
            if ('lower' in date) {
                const lowerBound = new Date(date.lower);
                tasks = tasks.filter((task) => {
                    const createdAt = new Date(task.CreatedAt);
                    return createdAt >= lowerBound;
                });
            }

            if ('upper' in date) {
                const upperBound = new Date(date.upper);
                tasks = tasks.filter((task) => {
                    const closedAt = new Date(task.TimeClosed);
                    return closedAt <= upperBound;
                });
            }
        }

        /* REPLACE FKS WITH REAL VALUES */

        /* EMBED ARRAYS */

        projects = projects.map((project) => {
            const updated = { ...project };
            updated.tasks = tasks.filter((task) => task.ProjectID === project.ID);
            return updated;
        });

        workspaces = workspaces.map((workspace) => {
            const updated = { ...workspace };
            updated.projects = projects.filter((project) => project.WorkspaceID === workspace.ID);
            return updated;
        });

        const requestedBy = userId;
        const requestedAt = Date.now();
        return { workspaces, requestedBy, requestedAt };
    }

    static getWorkspacesSQL(workspaceIds) {
        if (!workspaceIds.length) return 'SELECT * FROM workspace';
        return `SELECT * FROM workspace WHERE ID in (${workspaceIds.join(',')})`;
    }

    static getProjectsSQL(projectIds, workspaceIds) {
        if (projectIds.length) return `SELECT * FROM project WHERE ID in (${projectIds.join(',')})`;
        if (workspaceIds.length)
            return `SELECT * FROM project WHERE WorkspaceID in (${workspaceIds.join(',')})`;
        return 'SELECT * FROM project';
    }

    static getTasksSQL(projectIds, workspaceIds) {
        if (projectIds.length)
            return `SELECT * FROM task WHERE ProjectID in (${projectIds.join(',')})`;
        if (workspaceIds.length)
            return `SELECT * FROM task WHERE WorkspaceID in (${workspaceIds.join(',')})`;
        return 'SELECT * FROM task';
    }
}

module.exports = ReportService;
