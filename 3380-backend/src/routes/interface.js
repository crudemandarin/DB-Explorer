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

/* POST /interface/query */
router.post('/query', async (req, res) => {
    console.log('POST /interface/query');

    const { table, select, where } = req.body;
    if (!table) return res.status(400).json({ message: 'Missing `table` in body' });

    console.log(table, select, where);

    try {
        const rows = await SQLManager.select(table, select, where);
        return res.status(200).json({ rows });
    } catch (err) {
        console.log(err);
    }

    return res.status(500).json({ message: 'Failed to load query' });
});

/* POST /interface/query/data */
router.post('/query/data', async (req, res) => {
    console.log('POST /interface/query/data');

    console.log(req.body);
    const { table, fields } = req.body;

    if (!table) return res.status(400).json({ message: 'Missing `table` in body' });
    if (!fields) return res.status(400).json({ message: 'Missing `fields` in body' });
    if (!Array.isArray(fields))
        return res.status(400).json({ message: '`fields` is not an array' });
    if (fields.length === 0) return res.status(400).json({ message: '`fields` is empty' });

    try {
        const rows = await SQLManager.insert(table, fields);
        return res.status(200).json({ rows });
    } catch (err) {
        console.log(err);
    }

    return res.status(500).json({ message: 'Failed to post data' });
});

/* DELETE /interface/query/data */
router.delete('/query/data', async (req, res) => {
    console.log('DELETE /interface/query/data');
    const { table, id } = req.body;

    if (!table) return res.status(400).json({ message: 'Missing `table` in body' });

    try {
        const rows = await SQLManager.delete(table, id);
        return res.status(200).json({ rows });
    } catch (err) {
        console.log(err);
    }
    return res.status(500).json({ message: 'Failed to delete data' });
});

/* PUT /interface/query/data */
router.put('/query/data', async (req, res) => {
    console.log('PUT /interface/query/data');

    const { table, fields, where } = req.body;

    if (!table) return res.status(400).json({ message: 'Missing `table` in body' });
    if (!fields) return res.status(400).json({ message: 'Missing `fields` in body' });
    if (!Array.isArray(fields))
        return res.status(400).json({ message: '`fields` is not an array' });
    if (fields.length === 0) return res.status(400).json({ message: '`fields` is empty' });
    if (!where) return res.status(400).json({ message: 'Missing `where` in body' });
    if (!Array.isArray(where)) return res.status(400).json({ message: '`where` is not an array' });
    if (where.length === 0) return res.status(400).json({ message: '`where` is empty' });

    try {
        const result = await SQLManager.update(table, fields, where);
        return res.status(200).json({ result });
    } catch (err) {
        console.log(err);
    }

    return res.status(500).json({ message: 'Failed to update data' });
});

module.exports = router;
