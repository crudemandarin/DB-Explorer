const express = require('express');

const router = express.Router();

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

module.exports = router;
