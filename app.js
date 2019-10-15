const express = require('express');

// Set up the express app
const app = express();

//Require the custom routes into api
//require('./routes')(app);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
  }));
module.exports = app;