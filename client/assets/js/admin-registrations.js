/*
 * admin-registrations.js
 *
 * This file contains the JavaScript code for the admin registration page.
 *
 */

const spAuth = require('node-sp-auth');
const spRequest = require('sp-request');
const requestPromise = require('request-promise');

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

module.exports = {
    fetchRegistrationListData,
    initializeRegistrationListData,
    formatDate
};
