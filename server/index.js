// index.js
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const realm = process.env.REALM;
const siteUrl = process.env.SITE_URL;
const listName = process.env.LIST_NAME;

// Serve static files from the 'client/assets' directory
app.use(express.static(path.join(__dirname,'..', 'client', 'assets')));

// Serve static files from the 'client/public/test' directory
app.use('/test', express.static(path.join(__dirname, 'client', 'public', 'test')));

// Require route handler modules
const userRoutes = require('./routes/userRoutes');

// Use route handler modules
app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
