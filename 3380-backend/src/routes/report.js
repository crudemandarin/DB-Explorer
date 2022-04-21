const express = require('express');

const router = express.Router();

const ReportService = require('../services/ReportService');

/* GET /report */
router.get('/', async (req, res) => {
    console.log('GET /report');

    const { userId, workspaceIds = '[]', projectIds = '[]', lowerBound, upperBound } = req.query;

    const workspacesObj = JSON.parse(workspaceIds);
    const projectsObj = JSON.parse(projectIds);

    const messages = [];
    // if (!userId) messages.push('Missing `userId` in query params');
    if (workspaceIds && !Array.isArray(workspacesObj))
        messages.push('`workspaceIds` must be an array in query params');
    if (projectIds && !Array.isArray(projectsObj))
        messages.push('`projectIds` must be an array in query params');

    if (messages.length) return res.status(400).json({ messages });

    try {
        const report = await ReportService.getReport(
            userId,
            workspacesObj,
            projectsObj,
            lowerBound,
            upperBound
        );
        return res.status(200).json({ report });
    } catch (err) {
        console.error(err);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = router;
