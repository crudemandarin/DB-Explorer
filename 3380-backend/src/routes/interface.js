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

/* POST /interface/query/select */
router.post('/query/select', async (req, res) => {
    console.log('POST /interface/query/select');

    const { table, fields } = req.body;
    if (!table) return res.status(400).json({ message: 'Missing `table` in body' });
    console.log(fields);

    try {
        const rows = await SQLManager.getSelectQuery(table, fields);
        return res.status(200).json(rows);
    } catch (err) {
        console.log(err);
    }

    return res.status(500).json({ message: 'Failed to load query result' });
});

/* POST /interface/query/insert */
router.post('/query/insert', async (req, res) => {
    console.log('POST /interface');
    console.log(req.body);
    const { table, fields } = req.body;
    if (!table) return res.status(400).json({ message: 'Missing `table` in body' });

    try {
        const rows = await SQLManager.performInsert(table, fields);
        return res.status(200).json({ rows });
    } catch (err) {
        console.log(err);
    }

    return res.status(501).json({ message: 'Not implemented' });
});

/* DELETE /interface */
router.delete('/query/delete', async (req, res) => {
    console.log('DELETE /interface/query/delete');
    const { table, id } = req.body;

    if (!table) return res.status(400).json({ message: 'Missing `table` in body' });

    try {
        const rows = await SQLManager.performDelete(table, id);
        return res.status(200).json({ rows });
    } catch (err) {
        console.log(err);
    }
    return res.status(501).json({ message: 'Not implemented' });
});

/* PUT /interface */
router.put('/', async (req, res) => {
    console.log('PUT /interface');
    const { table, id, fields } = req.body;

    if (!table) return res.status(400).json({ message: 'Missing `table` in body' });

    try {
        const rows = await SQLManager.performUpdate(table, id);
        return res.status(200).json({ rows });
    } catch (err) {
        console.log(err);
    }
    return res.status(501).json({ message: 'Not implemented' });
});

module.exports = router;
