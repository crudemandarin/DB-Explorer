const express = require('express');
const { select } = require('../SQLManager');

const router = express.Router();
const USER_TABLE_NAME = 'User';
const USER_TABLE_EMAIL_FIELD = 'Email';

const SQLManager = require('../SQLManager');

/* POST /user/login */
router.get('/login', async (req, res) => {
    console.log('POST /user/login');
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: `Bad input - missing email` })
    }
    const where = { 'name': USER_TABLE_EMAIL_FIELD, 'value': email };
    const user = await SQLManager.select(USER_TABLE_NAME, '*', [where]);
    if (!user) {
        return res.status(404).json({ message: `User doesn't exist` })
    }
    return res.status(200).json({ user });
});

module.exports = router;
