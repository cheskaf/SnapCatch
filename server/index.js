/*
 * index.js
 * 
 * This is the main entry point of the server-side application.
 * It sets up the Express.js server, defines routes, and starts listening for incoming requests.
 *
 */

// Import required packages and libraries
// import dotenv from 'dotenv';
// const result = dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const spAuth = require('node-sp-auth');
const spRequest = require('sp-request');
const requestPromise = require('request-promise');
const multer = require('multer');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name for storing
    }
});

// Create multer instance with storage configuration
const upload = multer({ storage: storage });

// Environment variables
const PORT = 3000; // Port 3000 is the default port if no other port is set
const siteUrl = "https://7ttnyd.sharepoint.com/sites/Boracay";
const listTitle = "CNECustomerRegistrationForm";
const trainingListTitle = "TrainingList"

// Credentials for SharePoint authentication
const credentials = {
    clientId: "7355e8b5-cdc8-4ae7-b9ed-97b6865445f5",
    clientSecret: "QWHYuZaioPL82r/UXoXzgP8OyqE7R/v0rl2B9/QVPfw=",
    realm: "fcce36ce-3dbe-4de4-8435-dc6c0b09e0d6"
};

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Set the views directory and the view engine
app.set('views', path.join(__dirname, '..', 'client', 'public'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'client', 'assets')));
app.use('/admin/manage', express.static(path.join(__dirname, '..', 'client', 'assets')));

// Require route handler modules
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use route handler modules
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

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

// Create a route handler for fetching data from a SharePoint list
app.get('/api/lists/:listTitle', (req, res) => {
    const { listTitle } = req.params; // Get the listTitle from the request parameters

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

// Require the createListItem function from the registration.js file
const { createListItem } = require('../client/assets/js/registration');

// ----------------- CREATE ----------------------
// Update the route handler for form submission to use multer for parsing form data
app.post('/api/create-list-item/:listTitle', upload.single('file'), async (req, res) => {
    try {
        const listTitle = req.params.listTitle;
        const data = req.body;
        const file = req.file;

        console.log('Received data:', data);
        console.log('List title:', listTitle);

        const listItemResponse = await createListItem(data, listTitle, file);

        // Send a simplified response without circular references
        res.status(201).json({ message: 'Item created successfully', itemId: listItemResponse.body.d.Id });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});


// Require the updateListItem function from the registration.js file
const { updateListItem } = require('../client/assets/js/admin-registrations');

//----------DELETE----------------
app.delete('/api/delete-list-item/:listTitle/:itemId', async (req, res) => {
    try {
        const { listTitle, itemId } = req.params;

        await deleteListItem(itemId);

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});