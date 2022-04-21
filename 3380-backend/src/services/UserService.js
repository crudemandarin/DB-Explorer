const SQLService = require('./SQLService');

class UserService {
    static async login(email) {
        const where = [{ name: 'Email', value: email }];
        const [users] = await SQLService.select('User', [], where);
        console.log(users);
        if (users.length) return users[0];
        return undefined;
    }

    static async select(userId, table, select, where) {
        console.log(
            `UserService.select invoked! UserId = ${userId}, Table = ${table}, Fields = ${select}, Where =`,
            where
        );

        if (!userId) return SQLService.select(table, select, where);

        const selectCurrentUserWorkspaceUserIds = `SELECT ID FROM WorkspaceUser WHERE UserID='${userId}'`;
        const selectCurrentUserWorkspaceIds = `SELECT WorkspaceID FROM WorkspaceUser WHERE UserID='${userId}'`;

        const selectL0ProjectIdsSQL = `SELECT ProjectID FROM WorkspaceUserProjectRelation WHERE WorkspaceUserID IN (${selectCurrentUserWorkspaceUserIds})`;
        const selectL0UserIds = `SELECT UserID FROM WorkspaceUser WHERE WorkspaceID IN (${selectCurrentUserWorkspaceIds})`;

        let FROM = '';

        switch (table.toLowerCase()) {
            case 'department': {
                FROM = `SELECT * FROM ${table} WHERE WorkspaceID IN (${selectCurrentUserWorkspaceIds})`;
                break;
            }
            case 'project': {
                FROM = `SELECT * FROM ${table} WHERE ID IN (${selectL0ProjectIdsSQL})`;
                break;
            }
            case 'tag': {
                FROM = `SELECT * FROM ${table} WHERE ProjectID IN (${selectL0ProjectIdsSQL}) OR WorkspaceID IN (${selectCurrentUserWorkspaceIds})`;
                break;
            }
            case 'task': {
                FROM = `SELECT * FROM ${table} WHERE ProjectID IN (${selectL0ProjectIdsSQL})`;
                break;
            }
            case 'user': {
                FROM = `SELECT * FROM ${table} WHERE ID IN (${selectL0UserIds})`;
                break;
            }
            case 'userworkspacerelation': {
                FROM = `SELECT * FROM ${table} WHERE UserID='${userId}'`;
                break;
            }
            case 'workspace': {
                FROM = `SELECT * FROM ${table} WHERE ID IN (${selectCurrentUserWorkspaceIds})`;
                break;
            }
            case 'workspaceuser': {
                FROM = `SELECT * FROM ${table} WHERE WorkspaceID IN (${selectCurrentUserWorkspaceIds})`;
                break;
            }
            case 'workspaceuserprojectrelation': {
                FROM = `SELECT * FROM ${table} WHERE WorkspaceUserID IN (${selectCurrentUserWorkspaceUserIds})`;
                break;
            }
            default: {
                break;
            }
        }

        const fromSql = FROM ? `(${FROM}) AS AccessibleSubset` : undefined;
        return SQLService.select(table, select, where, fromSql);
    }
}

module.exports = UserService;
