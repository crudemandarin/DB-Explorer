const SQLService = require('./SQLService');

class UserService {
    static async login(email) {
        const user = UserService.getUser({ email });

        // Add password logic here
        
        return user;
    }

    static async select(userId, table, select, where) {
        console.log(
            `UserService.select invoked! UserId = ${userId}, Table = ${table}, Select = ${select}, Where =`,
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

    static async insert(userId, table, fields) {
        console.log(
            `UserService.insert invoked! UserId = ${userId}, Table = ${table}, Fields = ${fields}`
        );

        if (!userId) return SQLService.insert(table, fields);

        // Add insert limitations here
        // Examples:
        //  - Verify user has access to Foreign Keys they attempt to insert with
        //  - Verify user has permission to insert to specific table

        return SQLService.insert(table, fields);
    }

    static async delete(userId, table, rowParams) {
        console.log(
            `UserService.delete invoked! UserId = ${userId}, Table = ${table}, rowParams = ${rowParams}`
        );

        if (!userId) return SQLService.delete(table, rowParams);

        // Add delete limitations here
        // Examples:
        //  - Verify user has permission to delete the specific rows in this specific table

        return SQLService.delete(table, rowParams);
    }

    static async update(userId, table, rowParams) {
        console.log(
            `UserService.update invoked! UserId = ${userId}, Table = ${table}, rowParams = ${rowParams}`
        );

        if (!userId) return SQLService.update(table, rowParams);

        // Add update limitations here
        // Examples:
        //  - Verify user has access to Foreign Keys they attempt to update with
        //  - Verify user has permission to update to specific table

        return SQLService.update(table, rowParams);
    }

    static async getUser({ userId, email }) {
        if (!userId && !email) return undefined;
        const where = userId ?
            [{ name: 'ID', value: userId }] :
            [{ name: 'Email', value: email }];
        const [users] = await SQLService.select('User', [], where);
        console.log(users);
        if (users.length) return users[0];
        return undefined;
    }
}

module.exports = UserService;
