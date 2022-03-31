const express = require('express');

const router = express.Router();

const SQLManager = require('../SQLManager');

/* GET /interface/tables */
router.get('/tables', async (req, res) => {
    console.log('GET /interface/tables');

    try {
        const tables = await SQLManager.getTables();
        return res.status(200).json({ tables });
    } catch (err) {
        console.log(err);
    }

    return res.status(500).json({ message: 'Failed to load tables' });
});

/* GET /interface/fields?table= */
router.get('/fields', async (req, res) => {
    console.log('GET /interface/fields');

    const { table } = req.query;
    if (!table) return res.status(400).json({ message: 'Missing `table` in query parameters' });

    try {
        const fields = await SQLManager.getTableFields(table);
        return res.status(200).json({ fields });
    } catch (err) {
        console.log(err);
    }

    return res.status(500).json({ message: 'Failed to load table fields' });
});

/* GET /interface/query */
router.get('/query', async (req, res) => {
    console.log('GET /interface/query');

    const { table } = req.query;
    if (!table) return res.status(400).json({ message: 'Missing `table` in query parameters' });

    try {
        const fields = await SQLManager.getTableFields(table);
        return res.status(200).json({ fields });
    } catch (err) {
        console.log(err);
    }

    return res.status(500).json({ message: 'Failed to load table fields' });
});

module.exports = router;
