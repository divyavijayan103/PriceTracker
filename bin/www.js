const http = require('http');
const app = require('../app');
const port = parseInt(process.env.PORT, 10)||3000;
app.set('port', port);

//http.createServer() method turns the system into an HTTP server.
//Syntax: http.createServer(requestListener);
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`listening on port ${port}!`);
  });