/* 
 * registration.js
 *
 * This file contains the client-side JavaScript code for the User - Registration Page.
 *
 *
 */ 

// Import required packages and libraries
const spAuth = require('node-sp-auth');
const spRequest = require('sp-request');
const requestPromise = require('request-promise');
const nodemailer = require('nodemailer');
const emailTemplate = require('./emailTemplate');
const fs = require('fs');

// Environment variables
const PORT = process.env.PORT || 3000; // Port 3000 is the default port if no other port is set
const siteUrl = process.env.SITE_URL;
const registrationListTitle = process.env.LIST_TITLE;
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

// Create an instance of the sp-request library with the provided credentials
const spr = spRequest.create(credentials);

async function createListItem(data, listTitle, file) {
    try {
        const digest = await spr.requestDigest(siteUrl);

        // Create the list item in SharePoint
        const listItemResponse = await spr.post(`${siteUrl}/_api/web/lists/GetByTitle('${listTitle}')/items`, {
            headers: {
                'X-RequestDigest': digest,
                'Content-Type': 'application/json;odata=verbose',
            },
            body: {
                '__metadata': { 'type': `SP.Data.${listTitle}ListItem` },
                ...data,
            },
            json: true,
        });

        const itemId = listItemResponse.body.d.Id; // Get the item ID from the response
        console.log('ItemID from createListItem:', itemId)

        // Upload attachment if file is present
        if (file) {
            await uploadAttachment(file, listTitle, itemId);
            // Update the list item to include the attachment
            //await updateListItemAttachment(listTitle, itemId, file);
        }

        // if the list is equal to registrationListTitle then send email notification
        if (listTitle === registrationListTitle) {
            // Send email notification
            await sendEmailNotification(data.FirstName, data.Email, data);
        }

        return listItemResponse;
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
}

// Function to upload attachment to SharePoint list item
async function uploadAttachment(file, listTitle, itemId) {
    try {
        console.log('File uploaded:', file); // Log file details

        const fileName = file.originalname;
        const fileOptions = {
            fileName: fileName,
            fileContent: fs.readFileSync(file.path)
        };

        const endpointUrl = `${siteUrl}/_api/web/lists/getbytitle('${listTitle}')/items(${itemId})/AttachmentFiles/add(FileName='${fileName}')`;
        const options = await spAuth.getAuth(siteUrl, credentials);

        await requestPromise.post({
            url: endpointUrl,
            headers: {
                ...options.headers,
                'X-RequestDigest': options.headers['X-RequestDigest'],
            },
            body: fileOptions.fileContent,
            encoding: null, // Set encoding to null to keep binary data
        });

        console.log('Attachment uploaded successfully!');
    } catch (error) {
        console.error('Error uploading attachment:', error);
        throw error;
    }
}

const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

async function sendEmailNotification(name, email, data) {
    try {
        const mailOptions = {
            from: {
                name: 'SnapCatch Team',
                address: 'reg.training209@gmail.com',
                icon: 'img/branding/snapcatch.png' // Customize sender icon
            },
            to: email,
            subject: 'SnapCatch: Registration Successful',
            html: emailTemplate(name, email, data) // Use HTML instead of plain text
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}


module.exports = { createListItem, uploadAttachment };