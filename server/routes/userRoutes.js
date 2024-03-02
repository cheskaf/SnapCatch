// userRoutes.js

const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// Environment variables
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
const { initializeTrainingListData, formatDate } = require('../../client/src/trainingList');

// Initialize training list data when the server starts
initializeTrainingListData(siteUrl, credentials, trainingListTitle)
    .then(trainingListData => {
        console.log('Training list data initialized:', trainingListData);
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

router.get('/register', (req, res) => {
    // Extract data from query parameter
    const encodedData = req.query.data;
    // Decode the data
    const decodedData = decodeURIComponent(encodedData);
    // Split the decoded data into individual attributes
    const [ID, Title, DateFrom, DateTo, Location] = decodedData.split('-');
    // Now you can use these values as needed
    res.render('user-registration', { ID, Title, DateFrom, DateTo, Location });
});

// Endpoint to render HTML template with training list data
router.get('/trainings', async (req, res) => {
    try {
        const trainingListData = await initializeTrainingListData(siteUrl, credentials, trainingListTitle);
        // Format dates before passing them to the HTML template
        trainingListData.d.results.forEach(item => {
            item.formattedDateFrom = formatDate(item.DateFrom);
            item.formattedDateTo = formatDate(item.DateTo);
        });
        res.render('user-traininglist', { trainingListData });
    } catch (error) {
        console.error('Error fetching training list data:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;