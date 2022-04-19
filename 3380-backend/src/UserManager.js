class UserManager {
    static getReport(userId, workspaces, projects, date) {
        console.log(userId, workspaces, projects, date);
        const GET_WORKSPACES_SQL = workspaces.length
            ? `SELECT * FROM Workspaces WHERE ID in (${workspaces.join(',')})`
            : 'SELECT * FROM Workspaces';
    }
}

module.exports = UserManager;
