// userRoutes.js

const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// Environment variables
const PORT = process.env.PORT || 3000; // Port 3000 is the default port if no other port is set
const siteUrl = process.env.SITE_URL;
const listTitle = process.env.LIST_TITLE;
const trainingListTitle = process.env.TRAINING_LIST_TITLE;

// Credentials for SharePoint authentication
const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    realm: process.env.REALM
};

// Import required modules
const { initializeTrainingListData, formatDate, generateQRCode, generateUniqueUrls } = require('../../client/src/trainingList');

// Initialize training list data when the server starts
initializeTrainingListData(siteUrl, credentials, trainingListTitle)
    .then(trainingListData => {
        // console.log('Training list data initialized:', trainingListData);
        // Now you can use the training list data in your application as needed
    })
    .catch(err => {
        console.error('Error initializing training list data:', err);
    });


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'index.html'));
});

router.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'test.html'));
});

router.get('/register', async (req, res) => {
    // Fetch training list data
    const trainingListData = await initializeTrainingListData(siteUrl, credentials, trainingListTitle);

    // Extract id from query parameters
    const { id } = req.query;

    // Check if id exists in training list data
    const trainingData = trainingListData.d.results.find(item => item.ID == id);

    if (!trainingData) {
        res.render('user-registration', { message: 'Training is not available' });
    } else {
        // Extract data from trainingData
        const { title, dateFrom, dateTo, location } = trainingData;

        // Format dateFrom and dateTo
        const formattedDateFrom = formatDate(dateFrom);
        const formattedDateTo = formatDate(dateTo);

        // Generate QR code URL for the registration
        const qrCodeUrl = await generateQRCode(req.originalUrl);

        // Get the current URL
        const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        res.render('user-registration', { id, title, formattedDateFrom, formattedDateTo, location, qrCodeUrl, currentUrl });
    }
});

// Endpoint to render HTML template with training list data
router.get('/trainings', async (req, res) => {
    try {
        // Fetch training list data
        const trainingListData = await initializeTrainingListData(siteUrl, credentials, trainingListTitle);
        // Format dates before passing them to the HTML template
        trainingListData.d.results.forEach(item => {
            item.formattedDateFrom = formatDate(item.DateFrom);
            item.formattedDateTo = formatDate(item.DateTo);
            console.log("ID:", item.ID);
        });
        res.render('user-traininglist', { trainingListData });
    } catch (error) {
        console.error('Error fetching training list data:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;