/*
 * admin-registrations.js
 *
 * This file contains the JavaScript code for the admin registration page.
 *
 */

const spAuth = require('node-sp-auth');
const spRequest = require('sp-request');
const requestPromise = require('request-promise');

// Environment variables
const PORT = process.env.PORT || 3000; // Port 3000 is the default port if no other port is set
const siteUrl = process.env.SITE_URL;
const listTitle = process.env.LIST_TITLE;
const trainingListTitle = process.env.TRAINING_LIST_TITLE;
const emailService = process.env.EMAIL_SERVICE;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

// Credentials for SharePoint authentication
const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    realm: process.env.REALM
};

// Function to fetch data from the Registration List
async function fetchRegistrationListData(siteUrl, credentials, registrationListTitle) {
    try {
        // Get authentication headers
        const options = await spAuth.getAuth(siteUrl, credentials);
        const headers = options.headers;
        // Ensure headers accept JSON response
        headers['Accept'] = 'application/json;odata=verbose';

        // Perform GET request to SharePoint API using requestPromise
        const response = await requestPromise.get({
            url: `${siteUrl}/_api/web/lists/getbytitle('${registrationListTitle}')/items`,
            headers: headers,
            json: true // Automatically parse JSON response
        });

        return response;
    } catch (error) {
        throw error;
    }
}

// Function to initialize registration list data
async function initializeRegistrationListData(siteUrl, credentials, registrationListTitle) {
    try {
        const registrationListData = await fetchRegistrationListData(siteUrl, credentials, registrationListTitle);
        return registrationListData;
    } catch (error) {
        throw error;
    }
}

// Function to format date
function formatDate(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);
    // Format the date as needed (for example, using toLocaleDateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true});
}

// Function to delete a registration
async function deleteRegistration(siteUrl, credentials, registrationListTitle, id) {
    try {
        // Get authentication headers
        const options = await spAuth.getAuth(siteUrl, credentials);
        const headers = options.headers;
        // Ensure headers accept JSON response
        headers['Accept'] = 'application/json;odata=verbose';
        // Set the request body
        const body = {
            '__metadata': { 'type': 'SP.Data.RegistrationsListItem' },
            'Status': 'Cancelled'
        };
        // Perform MERGE request to update the registration status
        await requestPromise.merge({
            url: `${siteUrl}/_api/web/lists/getbytitle('${registrationListTitle}')/items(${id})`,
            headers: headers,
            body: body,
            json: true // Automatically parse JSON response
        });
    } catch (error) {
        throw error;
    }
}

// Create an instance of the sp-request library with the provided credentials
const spr = spRequest.create(credentials);

async function deleteListItem(listTitle, itemId) {
    try {
        const digest = await spr.requestDigest(siteUrl);
        return spr.post(`${siteUrl}/_api/web/lists/GetByTitle('${listTitle}')/items(${itemId})`, {
            headers: {
                'X-RequestDigest': digest,
                'X-HTTP-Method': 'DELETE',
                'If-Match': '*'
            }
        });
    } catch (error) {
        console.error('Error deleting item:', error, itemId);
    }
}

// updateListItem
async function updateListItem(listTitle, itemId, data) {
    console.log('updateListItem', listTitle, itemId, data);
    try {
        const digest = await spr.requestDigest(siteUrl);
        return spr.post(`${siteUrl}/_api/web/lists/GetByTitle('${listTitle}')/items(${itemId})`, {
            headers: {
                'X-RequestDigest': digest,
                'X-HTTP-Method': 'MERGE',
                'If-Match': '*'
            },
            body: data,
            json: true
        });
    } catch (error) {
        console.error('Error updating item:', error, itemId);
    }
}

module.exports = {
    fetchRegistrationListData,
    initializeRegistrationListData,
    formatDate,
    deleteRegistration,
    deleteListItem,
    updateListItem
};
