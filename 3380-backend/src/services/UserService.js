/* eslint-disable no-throw-literal */
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

        const [workspaceUsers] = await SQLService.select(
            'WorkspaceUser',
            [],
            [{ name: 'UserID', value: userId }]
        );

        switch (table.toLowerCase()) {
            case 'workspaceuser': {
                const workspaceIdField = fields.find((field) => field.name === 'WorkspaceID');
                if (!workspaceIdField) throw { code: 400, message: 'Missing WorkspaceID' };
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceIdField.value
                );
                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role < 1)
                    throw { code: 403, message: 'User does not have access to resource' };
                break;
            }
            case 'department': {
                const workspaceIdField = fields.find((field) => field.name === 'WorkspaceID');
                if (!workspaceIdField) throw { code: 400, message: 'Missing WorkspaceID' };
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceIdField.value
                );
                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role < 1)
                    throw { code: 403, message: 'User does not have access to resource' };
                break;
            }
            case 'project': {
                const workspaceIdField = fields.find((field) => field.name === 'WorkspaceID');
                if (!workspaceIdField) throw { code: 400, message: 'Missing WorkspaceID' };
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceIdField.value
                );
                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role < 1)
                    throw { code: 403, message: 'User does not have access to resource' };
                break;
            }
            case 'workspaceuserprojectrelation': {
                const workspaceUserIdField = fields.find(
                    (field) => field.name === 'WorkspaceUserID'
                );
                if (!workspaceUserIdField) throw { code: 400, message: 'Missing WorkspaceUserID' };

                const projectIdField = fields.find((field) => field.name === 'ProjectID');
                if (!projectIdField) throw { code: 400, message: 'Missing ProjectID' };

                const [workspaceUserWorkspaceIds] = await SQLService.select(
                    'WorkspaceUser',
                    ['WorkspaceID'],
                    [{ name: 'ID', value: workspaceUserIdField.value }]
                );
                if (!workspaceUserWorkspaceIds.length)
                    throw {
                        code: 400,
                        message: `WorkspaceUser with ID ${workspaceUserIdField.value} does not exist`,
                    };
                const workspaceUserWorkspaceId = workspaceUserWorkspaceIds[0].WorkspaceID;

                const [projectWorkspaceIds] = await SQLService.select(
                    'Project',
                    ['WorkspaceID'],
                    [{ name: 'ID', value: projectIdField.value }]
                );
                if (!projectWorkspaceIds.length)
                    throw {
                        code: 400,
                        message: `Project with ID ${projectIdField.value} does not exist`,
                    };
                const projectWorkspaceId = projectWorkspaceIds[0].WorkspaceID;

                if (workspaceUserWorkspaceId !== projectWorkspaceId)
                    throw {
                        code: 400,
                        message: `WorkspaceUser and Project belong to different workspaces`,
                    };

                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceUserWorkspaceId
                );

                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role < 1)
                    throw { code: 403, message: 'User does not have access to resource' };

                break;
            }
            case 'task': {
                const workspaceIdField = fields.find((field) => field.name === 'WorkspaceID');
                if (!workspaceIdField) throw { code: 400, message: 'Missing WorkspaceID' };

                const projectIdField = fields.find((field) => field.name === 'ProjectID');
                if (!projectIdField) throw { code: 400, message: 'Missing ProjectID' };

                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceIdField.value
                );

                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role === 0) {
                    const [relations] = await SQLService.select(
                        'WorkspaceUserProjectRelation',
                        [],
                        [
                            { name: 'ProjectID', value: projectIdField.value },
                            { name: 'WorkspaceUserID', value: workspaceUser.ID },
                        ]
                    );
                    if (relations.length === 0)
                        throw { code: 403, message: 'User does not have access to resource' };
                }
                break;
            }
            case 'tag': {
                const workspaceIdField = fields.find((field) => field.name === 'WorkspaceID');
                const projectIdField = fields.find((field) => field.name === 'ProjectID');
                const taskIdField = fields.find((field) => field.name === 'TaskID');
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceIdField.value
                );
                if (!workspaceUser) {
                    throw { code: 403, message: 'User does not have access to resource' };
                }
                if (!taskIdField && workspaceUser.Role < 1) {
                    throw { code: 403, message: 'User does not have access to resource' };
                }

                const [relations] = await SQLService.select(
                    'WorkspaceUserProjectRelation',
                    [],
                    [
                        { name: 'ProjectID', value: projectIdField },
                        { name: 'WorkspaceUserID', value: workspaceUser.ID },
                    ]
                );
                if (!relations) {
                    throw { code: 403, message: 'User does not have access to resource' };
                }
                break;
            }
            default: {
                break;
            }
        }

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

        // const selectCurrentUserWorkspaceUsers = `SELECT * FROM WorkspaceUser WHERE UserID='${userId}'`;
        const [workspaceUsers] = await SQLService.select(
            'WorkspaceUser',
            [],
            [{ name: 'UserID', value: userId }]
        );

        const params = rowParams[0];
        switch (table.toLowerCase()) {
            case 'workspace': {
                const workspaceId = params[0].value;
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceId
                );
                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role !== 2)
                    throw { code: 403, message: 'User does not have access to resource' };
                break;
            }
            case 'workspaceuser': {
                const workspaceUserId = params[0].value;
                const [workspaceIds] = await SQLService.select(
                    'WorkspaceUser',
                    ['WorkspaceID'],
                    [{ name: 'ID', value: workspaceUserId }]
                );
                const workspaceId = workspaceIds[0];
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceId
                );

                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role < 1)
                    throw { code: 403, message: 'User does not have access to resource' };
                break;
            }
            case 'department': {
                const departmentId = params[0].value;
                const [workspaceIds] = await SQLService.select(
                    'Department',
                    ['WorkspaceID'],
                    [{ name: 'ID', value: departmentId }]
                );
                const workspaceId = workspaceIds[0];
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceId
                );

                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role < 1)
                    throw { code: 403, message: 'User does not have access to resource' };
                break;
            }
            case 'project': {
                const projectId = params[0].value;
                const [workspaceIds] = await SQLService.select(
                    'Project',
                    ['WorkspaceID'],
                    [{ name: 'ID', value: projectId }]
                );
                const workspaceId = workspaceIds[0];
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceId
                );

                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role < 1)
                    throw { code: 403, message: 'User does not have access to resource' };
                break;
            }
            case 'workspaceuserprojectrelation': {
                const workspaceUserId = params.find((temp) => temp.name === 'WorkspaceUserID');
                const [workspaceIds] = await SQLService.select(
                    'WorkspaceUser',
                    ['WorkspaceID'],
                    [{ name: 'ID', value: workspaceUserId }]
                );
                const workspaceId = workspaceIds[0];
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceId
                );
                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role < 1)
                    throw { code: 403, message: 'User does not have access to resource' };
                break;
            }
            case 'task': {
                const taskId = params[0].value;
                const [tasks] = await SQLService.select(
                    'Task',
                    ['WorkspaceID', 'ProjectID'],
                    [{ name: 'ID', value: taskId }]
                );
                const task = tasks[0];
                const workspaceId = task.WorkspaceID;
                const projectId = task.ProjectID;

                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceId
                );

                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role === 0) {
                    const [relations] = await SQLService.select(
                        'WorkspaceUserProjectRelation',
                        [],
                        [
                            { name: 'ProjectID', value: projectId },
                            { name: 'WorkspaceUserID', value: workspaceUser.ID },
                        ]
                    );
                    if (relations.length === 0)
                        throw { code: 403, message: 'User does not have access to resource' };
                }

                if (!workspaceUser)
                    throw { code: 403, message: 'User does not have access to resource' };
                if (workspaceUser.Role === 0) {
                    const [relations] = await SQLService.select(
                        'WorkspaceUserProjectRelation',
                        [],
                        [
                            { name: 'ProjectID', value: projectId },
                            { name: 'WorkspaceUserID', value: workspaceUser.ID },
                        ]
                    );
                    if (relations.length === 0)
                        throw { code: 403, message: 'User does not have access to resource' };
                }
                break;
            }
            case 'tag': {
                const workspaceIdField = params.find((field) => field.name === 'WorkspaceID');
                const projectIdField = params.find((field) => field.name === 'ProjectID');
                const taskIdField = params.find((field) => field.name === 'TaskID');
                const workspaceUser = workspaceUsers.find(
                    (temp) => temp.WorkspaceID === workspaceIdField.value
                );
                if (!workspaceUser) {
                    throw { code: 403, message: 'User does not have access to resource' };
                }
                if (!taskIdField && workspaceUser.Role < 1) {
                    throw { code: 403, message: 'User does not have access to resource' };
                }

                const [relations] = await SQLService.select(
                    'WorkspaceUserProjectRelation',
                    [],
                    [
                        { name: 'ProjectID', value: projectIdField },
                        { name: 'WorkspaceUserID', value: workspaceUser.ID },
                    ]
                );
                if (!relations) {
                    throw { code: 403, message: 'User does not have access to resource' };
                }
                break;
            }
            default: {
                break;
            }
        }

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
