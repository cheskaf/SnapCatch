// userRoutes.js

const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const crypto = require('crypto');

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
const { initializeTrainingListData, formatDate, generateQRCode, generateUniqueUrls, fetchTrainingItemById } = require('../../client/src/trainingList');

// Initialize training list data when the server starts
initializeTrainingListData(siteUrl, credentials, trainingListTitle)
    .then(trainingListData => {
        // console.log('Training list data initialized:', trainingListData);
        // Now you can use the training list data in your application as needed
    })
    .catch(err => {
        console.error('Error initializing training list data:', err);
    });


// Endpoint to render HTML template with training list data
router.get('/', async (req, res) => {
    try {
        // Fetch training list data
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

router.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'test.html'));
});

router.get('/register/:id/:title/:hash', async (req, res) => {
    const { id, title, hash } = req.params;

    // Concatenate training ID and title
    const concatenatedString = `${id}-${title}`;

    // Hash the concatenated string using SHA-256
    const hashedValue = crypto.createHash('sha256').update(concatenatedString).digest('hex');

    // Verify if the hash matches the computed hash
    if (hashedValue !== hash) {
        return res.render('page-not-found');
    }

    // Fetch data based on the itemId
    const item = await fetchTrainingItemById(id, siteUrl, credentials, trainingListTitle);
    if (!item) {
        return res.render('page-not-found');
    }

    const itemData = item.d;    
    // Format dateFrom and dateTo
    const formattedDateFrom = formatDate(itemData.DateFrom);
    const formattedDateTo = formatDate(itemData.DateTo);
    // Generate QR code URL for the registration
    const qrCodeUrl = await generateQRCode(req.originalUrl);
    // Get the current URL
    const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    // Now you can use these values as needed
    res.render('user-registration', { id: itemData.Id, title: itemData.Title, formattedDateFrom, formattedDateTo, location: itemData.Location, qrCodeUrl, currentUrl });
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
        });
        res.render('user-traininglist', { trainingListData });
    } catch (error) {
        console.error('Error fetching training list data:', error);
        res.status(500).send('Internal server error');
    }
});

// Define a route to handle all unmatched routes
router.get('*', (req, res) => {
    res.status(404).render('page-not-found');
});


module.exports = router;