// adminRoutes.js

const express = require('express');
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
const { initializeRegistrationListData, formatDate } = require('../../client/assets/js/admin-registrations');

// Initialize training list data when the server starts
initializeRegistrationListData(siteUrl, credentials, trainingListTitle)
    .then(trainingListData => {
        // console.log('Training list data initialized:', trainingListData);
        // Now you can use the training list data in your application as needed
    })
    .catch(err => {
        console.error('Error initializing training list data:', err);
    });

// Import required modules
const { initializeTrainingListData } = require('../../client/src/trainingList');

// Initialize training list data when the server starts
initializeTrainingListData(siteUrl, credentials, trainingListTitle)
    .then(trainingListData => {
        // console.log('Training list data initialized:', trainingListData);
        // Now you can use the training list data in your application as needed
    })
    .catch(err => {
        console.error('Error initializing training list data:', err);
    });
    
// Endpoint to render HTML template with registration list data
router.get('/manage/registrations', async (req, res) => {
    try{
        // Fetch registration list data
        const registrationListData = await initializeRegistrationListData(siteUrl, credentials, listTitle);
        registrationListData.d.results.forEach(item => {
            item.formattedDateCreated = formatDate(item.Created);
            item.initials = item.FirstName.charAt(0) + item.LastName.charAt(0);
        });
        
        // Fetch training list data
        const trainingListData = await initializeTrainingListData(siteUrl, credentials, trainingListTitle);
        
        res.render('admin-registration', { registrationListData, trainingListData });
    } catch (error) {
        console.error('Error fetching registration list data:', error);
        res.status(500).send('Internal server error');
    }
    
});

router.get('/manage/trainings', async (req, res) => {
    try {
        // Fetch training list data
        const trainingListData = await initializeTrainingListData(siteUrl, credentials, trainingListTitle);
        // Format dates before passing them to the HTML template
        trainingListData.d.results.forEach(item => {
            item.formattedDateCreated = formatDate(item.Created);
            item.formattedDateFrom = formatDate(item.DateFrom);
            item.formattedDateTo = formatDate(item.DateTo);
            item.initials = item.Title.charAt(0);
        });
        res.render('admin-training', { trainingListData });
    } catch (error) {
        console.error('Error fetching training list data:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;