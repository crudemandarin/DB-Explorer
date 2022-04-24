const SQLService = require('./SQLService');
const Utils = require('../Utils');

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

        const user = await UserService.getUser({ userId });
        if (user.Role === 1) return SQLService.select(table, select, where);

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

        const updatedFields = await UserService.getUpdatedFields(fields, userId, table);

        const user = await UserService.getUser({ userId });
        if (user.Role === 1) return SQLService.insert(table, updatedFields);

        // Add insert limitations here
        // Examples:
        //  - Verify user has access to Foreign Keys they attempt to insert with
        //  - Verify user has permission to insert to specific table

        return SQLService.insert(table, updatedFields);
    }

    static async delete(userId, table, rowParams) {
        console.log(
            `UserService.delete invoked! UserId = ${userId}, Table = ${table}, rowParams = ${rowParams}`
        );

        const user = await UserService.getUser({ userId });
        if (user.Role === 1) return SQLService.delete(table, rowParams);

        // Add delete limitations here
        // Examples:
        //  - Verify user has permission to delete the specific rows in this specific table

        return SQLService.delete(table, rowParams);
    }

    static async update(userId, table, rowParams) {
        console.log(
            `UserService.update invoked! UserId = ${userId}, Table = ${table}, rowParams = ${rowParams}`
        );

        const user = await UserService.getUser({ userId });
        if (user.Role === 1) return SQLService.update(table, rowParams);

        // Add update limitations here
        // Examples:
        //  - Verify user has access to Foreign Keys they attempt to update with
        //  - Verify user has permission to update to specific table

        return SQLService.update(table, rowParams);
    }

    static async getUser({ userId, email }) {
        if (!userId && !email) return undefined;
        const where = userId ? [{ name: 'ID', value: userId }] : [{ name: 'Email', value: email }];
        const [users] = await SQLService.select('User', [], where);
        console.log(users);
        if (users.length) return users[0];
        return undefined;
    }

    static async getUpdatedFields(fields, userId, table) {
        const tableFields = await SQLService.getTableFields(table);

        let userIdParam = userId;

        const workspaceIdField = fields.find((field) => field.name === 'WorkspaceID');

        if (workspaceIdField && table !== 'Workspace') {
            const [workspaceUserIds] = await SQLService.select(
                'WorkspaceUser',
                ['ID'],
                [
                    { name: 'UserID', value: userId },
                    { name: 'WorkspaceID', value: workspaceIdField.value },
                ]
            );
            if (workspaceUserIds.length) {
                const workspaceUserId = workspaceUserIds[0].ID;
                console.log(workspaceUserId);
                userIdParam = workspaceUserId;
            }
        }

        return tableFields.reduce((previous, tableField) => {
            if (tableField.isPrimaryKey) {
                return [...previous, { name: tableField.name, value: Utils.getTableID() }];
            }

            if (['CreatedAt', 'LastUpdated'].includes(tableField.name)) {
                const value = new Date().toISOString().slice(0, 19).replace('T', ' ');
                return [
                    ...previous,
                    {
                        name: tableField.name,
                        value,
                    },
                ];
            }

            if (['CreatedBy', 'UpdatedBy'].includes(tableField.name)) {
                return [...previous, { name: tableField.name, value: userIdParam }];
            }

            if (Utils.getProtectedFields(table).includes(tableField.name)) {
                return previous;
            }

            const field = fields.find((obj) => obj.name === tableField.name);
            if (field) return [...previous, field];

            return previous;
        }, []);
    }
}

module.exports = UserService;
