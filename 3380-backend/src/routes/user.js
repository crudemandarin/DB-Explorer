const express = require('express');

const router = express.Router();

const UserManager = require('../UserManager');
const SQLManager = require('../SQLManager');

/* POST /user/login */
router.post('/login', async (req, res) => {
    console.log('POST /user/login');

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Missing `email` in body' });

    try {
        const table = 'User';
        const select = '*';
        const where = [{ name: 'Email', value: email }];
        const user = await SQLManager.select(table, select, where);
        if (!user.length) return res.status(404).json({ message: `User does not exist` });
        return res.status(200).json({ user: user[0] });
    } catch (err) {
        console.error(err);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
});

/* GET /user/report */
router.get('/report', async (req, res) => {
    console.log('GET /user/report');

    const { userId, workspaces, projects, date } = req.query;
    const workspacesObj = JSON.parse(workspaces);
    const projectsObj = JSON.parse(projects);

    if (!userId) return res.status(400).json({ message: 'Missing `userId` in query params' });
    if (!workspacesObj)
        return res.status(400).json({ message: 'Missing `workspaces` in query params' });
    if (!Array.isArray(workspacesObj))
        return res.status(400).json({ message: '`workspaces` must be an array in query params' });
    if (!projectsObj)
        return res.status(400).json({ message: 'Missing `projects` in query params' });
    if (!Array.isArray(projectsObj))
        return res.status(400).json({ message: '`projects` must be an array in query params' });
    if (!date) return res.status(400).json({ message: 'Missing `date` in query params' });

    try {
        const report = UserManager.getReport(userId, workspacesObj, projectsObj, date);
        return res.status(200).json({ report });
    } catch (err) {
        console.error(err);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = router;
