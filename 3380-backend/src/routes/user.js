const express = require('express');

const router = express.Router();

const SQLManager = require('../SQLManager');

/* POST /user/login */
router.get('/login', async (req, res) => {
    console.log('POST /user/login');

    return res.status(503).json({ message: 'Not implemented' });
});

module.exports = router;
