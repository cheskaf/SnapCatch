// userRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    // Send index.html file
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'index.html'));
});

router.get('/test', (req, res) => {
    // Send index.html file
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'test.html'));
});

module.exports = router;