const express = require('express');

const router = express.Router();

const ReportService = require('../services/ReportService');

/* GET /report */
router.get('/', async (req, res) => {
    console.log('GET /report');

    const { userId, workspaceIds, projectIds, date } = req.query;

    const workspacesObj = workspaceIds ? JSON.parse(workspaceIds) : undefined;
    const projectsObj = projectIds ? JSON.parse(projectIds) : undefined;
    const dateObj = date ? JSON.parse(date) : undefined;

    const messages = [];
    if (!userId) messages.push('Missing `userId` in query params');
    if (!workspaceIds) messages.push('Missing `workspaceIds` in query params');
    if (!Array.isArray(workspacesObj))
        messages.push('`workspaceIds` must be an array in query params');
    if (!projectIds) messages.push('Missing `projectIds` in query params');
    if (!Array.isArray(projectsObj)) messages.push('`projectIds` must be an array in query params');
    if (!date) messages.push('Missing `date` in query params');

    if (messages.length) return res.status(400).json({ messages });

    try {
        const report = await ReportService.getReport(userId, workspacesObj, projectsObj, dateObj);
        return res.status(200).json({ report });
    } catch (err) {
        console.error(err);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = router;
