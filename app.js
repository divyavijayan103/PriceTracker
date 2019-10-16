const express = require('express');
const bodyParser = require('body-parser');
// Set up the express app
const app = express();
const path = require('path');

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Require the custom routes into api
require('./routes')(app);

app.use(express.static(`${__dirname}/react-client/dist`));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/react-client/dist/index.html`));
});
module.exports = app;