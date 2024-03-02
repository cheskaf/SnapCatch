// adminRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/manage/registrations', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'admin-registration.html'));
});

router.get('/manage/trainings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'admin-training.html'));
});

module.exports = router;