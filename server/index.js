/*
 * index.js
 * 
 * This is the main entry point of the server-side application.
 * It sets up the Express.js server, defines routes, and starts listening for incoming requests.
 */

// Import required packages and libraries
const dotenv = require('dotenv');
const result = dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const spAuth = require('node-sp-auth');
const spRequest = require('sp-request');
const requestPromise = require('request-promise');

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

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Set the views directory and the view engine
app.set('views', path.join(__dirname, '..' ,'client', 'public'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Serve static files
app.use(express.static(path.join(__dirname,'..', 'client', 'assets')));
app.use('/admin/manage', express.static(path.join(__dirname, '..', 'client', 'assets')));

// Require route handler modules
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use route handler modules
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

// Create an instance of the sp-request library with the provided credentials
const spr = spRequest.create(credentials);

// Get authentication headers for SharePoint API requests
spAuth.getAuth(siteUrl, credentials)
    .then(options => {
        // Extract headers from authentication options
        const headers = options.headers;
        // Ensure headers accept JSON response
        headers['Accept'] = 'application/json;odata=verbose';

        // Perform GET request to SharePoint API using requestPromise
        return requestPromise.get({
            url: `${siteUrl}/_api/web`,
            headers: headers,
            json: true // Automatically parse JSON response
        });
    })
    .then(response => {
        // Log the title of the SharePoint web
        console.log(response.d.Title);
    })
    .catch(err => {
        // Log any error that occurs during the request
        console.error(err);
    });

// Fetch data from the Training List
app.get('/api/trainings', (req, res) => {
    // Get authentication headers
    spAuth.getAuth(siteUrl, credentials)
        .then(options => {
            // Extract headers from authentication options
            const headers = options.headers;
            // Ensure headers accept JSON response
            headers['Accept'] = 'application/json;odata=verbose';

            // Perform GET request to SharePoint API using requestPromise
            return requestPromise.get({
                url: `${siteUrl}/_api/web/lists/getbytitle('${trainingListTitle}')/items`,
                headers: headers,
                json: true // Automatically parse JSON response
            });
        })
        .then(response => {
            // Log the response from the SharePoint list
            console.log(response);
            // Send the response as the API response
            res.json(response);
        })
        .catch(err => {
            // Log any error that occurs during the request
            console.error(err);
            // Send the error as the API response
            res.json(err);
        });
});

// Fetch data from the Registrations List
app.get('/api/registrations', (req, res) => {
    // Get authentication headers
    spAuth.getAuth(siteUrl, credentials)
        .then(options => {
            // Extract headers from authentication options
            const headers = options.headers;
            // Ensure headers accept JSON response
            headers['Accept'] = 'application/json;odata=verbose';

            // Perform GET request to SharePoint API using requestPromise
            return requestPromise.get({
                url: `${siteUrl}/_api/web/lists/getbytitle('${listTitle}')/items`,
                headers: headers,
                json: true // Automatically parse JSON response
            });
        })
        .then(response => {
            // Log the response from the SharePoint list
            console.log(response);
            // Send the response as the API response
            res.json(response);
        })
        .catch(err => {
            // Log any error that occurs during the request
            console.error(err);
            // Send the error as the API response
            res.json(err);
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});