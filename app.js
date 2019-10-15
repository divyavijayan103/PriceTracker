const express = require('express');

// Set up the express app
const app = express();

//Require the custom routes into api
require('./routes')(app);
module.exports = app;