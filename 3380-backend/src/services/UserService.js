const SQLService = require('./SQLService');

class UserService {
    static async login(email) {
        const table = 'User';
        const select = '*';
        const where = [{ name: 'Email', value: email }];
        const [users] = await SQLService.select(table, select, where);
        console.log(users);
        if (users.length) return users[0];
        return undefined;
    }

    static async select(userId, table, select, where) {
        console.log(
            `UserService.select invoked! UserId = ${userId}, Table = ${table}, Fields = ${select}, Where =`,
            where
        );

        const selectCurrentUserWorkspaceUserIds = `SELECT ID FROM WorkspaceUser WHERE UserID='${userId}'`;
        const selectCurrentUserWorkspaceIds = `SELECT WorkspaceID FROM WorkspaceUser WHERE UserID='${userId}'`;

        const selectL0ProjectIdsSQL = `SELECT ProjectID FROM WorkspaceUserProjectRelation WHERE WorkspaceUserID in (${selectCurrentUserWorkspaceUserIds})`;
        const selectL0UserIds = `SELECT UserID FROM WorkspaceUser WHERE WorkspaceID in (${selectCurrentUserWorkspaceIds})`;

        let FROM = '';

        switch (table) {
            case 'Department': {
                console.log('Department');
                FROM = `SELECT * FROM ${table} WHERE WorkspaceID in (${selectCurrentUserWorkspaceIds})`;
                break;
            }
            case 'Project': {
                console.log('Project');
                FROM = `SELECT * FROM ${table} WHERE ID in (${selectL0ProjectIdsSQL})`;
                break;
            }
            case 'Tag': {
                console.log('Tag');
                FROM = `SELECT * FROM ${table} WHERE ProjectID in (${selectL0ProjectIdsSQL}) OR WorkspaceID in (${selectCurrentUserWorkspaceIds})`;
                break;
            }
            case 'Task': {
                console.log('Task');
                FROM = `SELECT * FROM ${table} WHERE ProjectID in (${selectL0ProjectIdsSQL})`;
                break;
            }
            case 'User': {
                console.log('User');
                FROM = `SELECT * FROM ${table} WHERE ID in (${selectL0UserIds})`;
                break;
            }
            case 'UserWorkspaceRelation': {
                console.log('UserWorkspaceRelation');
                FROM = `SELECT * FROM ${table} WHERE UserID='${userId}'`;
                break;
            }
            case 'Workspace': {
                console.log('Workspace');
                FROM = `SELECT * FROM ${table} WHERE ID in (${selectCurrentUserWorkspaceIds})`;
                break;
            }
            case 'WorkspaceUser': {
                console.log('WorkspaceUser');
                FROM = `SELECT * FROM ${table} WHERE WorkspaceID in (${selectCurrentUserWorkspaceIds})`;
                break;
            }
            case 'WorkspaceUserProjectRelation': {
                console.log('WorkspaceUserProjectRelation');
                FROM = `SELECT * FROM ${table} WHERE WorkspaceUserID in (${selectCurrentUserWorkspaceUserIds})`;
                break;
            }
            default: {
                break;
            }
        }

        const fromSql = FROM ? `(${FROM}) AS sub` : undefined;
        return SQLService.select(table, select, where, fromSql);
    }
}

module.exports = UserService;
