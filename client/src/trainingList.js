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
const qr = require('qrcode');
const crypto = require('crypto');

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

async function fetchTrainingItemById(id, siteUrl, credentials, trainingListTitle) {
    try {
        // Get authentication headers
        const options = await spAuth.getAuth(siteUrl, credentials);
        const headers = options.headers;
        // Ensure headers accept JSON response
        headers['Accept'] = 'application/json;odata=verbose';
        
        // Perform GET request to fetch training item by ID
        const response = await requestPromise.get({
            url: `${siteUrl}/_api/web/lists/getbytitle('${trainingListTitle}')/items(${id})`,
            headers: headers,
            json: true // Automatically parse JSON response
        });

        return response;
    } catch (error) {
        throw error;
    }
}

// Function to generate QR code
async function generateQRCode(url) {
    try {
        // Generate QR code as a data URL
        const qrCodeDataUrl = await qr.toDataURL(url);
        return qrCodeDataUrl;
    } catch (error) {
        throw error;
    }
}

// Modify the generateUniqueUrls function to include a unique hashed value, training ID, and title in the URL
async function generateUniqueUrls(data) {
    try {
        data.d.results.forEach(async (item) => {
            const trainingId = item.ID;
            const title = item.Title;

            // Concatenate training ID and title
            const concatenatedString = `${trainingId}-${title}`;

            // Hash the concatenated string using SHA-256
            const hashedValue = crypto.createHash('sha256').update(concatenatedString).digest('hex');

            const encodedID = encodeURIComponent(trainingId);
            const encodedTitle = encodeURIComponent(title);
            const encodedHash = encodeURIComponent(hashedValue);
            const encodedDateFrom = encodeURIComponent(item.DateFrom);
            const encodedDateTo = encodeURIComponent(item.DateTo);
            const encodedLocation = encodeURIComponent(item.Location);

            // Construct unique URL with hashed value, training ID, and title
            item.uniqueUrl = `/register/${encodedID}/${encodedTitle}/${encodedHash}?details=${encodedDateFrom}-${encodedDateTo}-${encodedLocation}`;

            // Generate QR code URL
            const qrCodeUrl = await generateQRCode(item.uniqueUrl);
            item.qrCodeUrl = qrCodeUrl;
        });
    } catch (error) {
        throw error;
    }
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
    fetchTrainingItemById,
    generateUniqueUrls,
    generateQRCode,
    initializeTrainingListData,
    formatDate
};
