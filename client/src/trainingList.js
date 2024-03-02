/* 
 * trainingList.js
 *
 * This file contains the client-side JavaScript code for the User - Training List page. 
 *
 *
 */


const spAuth = require('node-sp-auth');
const spRequest = require('sp-request');
const requestPromise = require('request-promise');

// Function to fetch data from the Training List
async function fetchTrainingListData(siteUrl, credentials, trainingListTitle) {
    try {
        // Get authentication headers
        const options = await spAuth.getAuth(siteUrl, credentials);
        const headers = options.headers;
        // Ensure headers accept JSON response
        headers['Accept'] = 'application/json;odata=verbose';

        // Perform GET request to SharePoint API using requestPromise
        const response = await requestPromise.get({
            url: `${siteUrl}/_api/web/lists/getbytitle('${trainingListTitle}')/items`,
            headers: headers,
            json: true // Automatically parse JSON response
        });

        return response;
    } catch (error) {
        throw error;
    }
}

// Function to generate unique URLs for each item
function generateUniqueUrls(data) {
    data.d.results.forEach(item => {
        // Construct a unique string using item attributes
        const uniqueString = `${item.ID}-${item.Title}-${item.DateFrom}-${item.DateTo}-${item.Location}`;
        // Encode the string to ensure it's URL-safe
        const encodedUniqueString = encodeURIComponent(uniqueString);
        // Construct the unique URL with query parameters
        item.uniqueUrl = `/register?data=${encodedUniqueString}`;
    });
}

// Function to initialize training list data
async function initializeTrainingListData(siteUrl, credentials, trainingListTitle) {
    try {
        const trainingListData = await fetchTrainingListData(siteUrl, credentials, trainingListTitle);
        generateUniqueUrls(trainingListData);
        return trainingListData;
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
    fetchTrainingListData,
    generateUniqueUrls,
    initializeTrainingListData,
    formatDate
};
