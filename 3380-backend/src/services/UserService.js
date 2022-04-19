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
}

module.exports = UserService;
