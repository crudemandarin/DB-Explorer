const express = require('express');

const router = express.Router();

const UserService = require('../services/UserService');

/* POST /user/login */
router.post('/login', async (req, res) => {
    console.log('POST /user/login');

    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: 'Missing `email` in body' });
    // if (!password) return res.status(400).json({ message: 'Missing `password` in body' });

    try {
        const user = await UserService.login(email, password);
        if (!user) return res.status(404).json({ message: `User not found` });
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = router;
