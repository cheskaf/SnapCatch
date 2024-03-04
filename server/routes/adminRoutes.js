// adminRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');

// Environment variables
const siteUrl = "https://7ttnyd.sharepoint.com/sites/Boracay";
const listTitle = "CNECustomerRegistrationForm";
const trainingListTitle = "TrainingList"

// Credentials for SharePoint authentication
const credentials = {
    clientId: "7355e8b5-cdc8-4ae7-b9ed-97b6865445f5",
    clientSecret: "QWHYuZaioPL82r/UXoXzgP8OyqE7R/v0rl2B9/QVPfw=",
    realm: "fcce36ce-3dbe-4de4-8435-dc6c0b09e0d6"
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
        res.render('admin-registration', { registrationListData });
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