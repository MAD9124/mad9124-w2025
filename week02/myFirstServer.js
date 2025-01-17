'use strict';

const http = require('http');
const students = require('../week01/exercise/students.json');

const server = http.createServer((request, response) => {
  if (request.url === '/feed') {
    response.write('This is your news feed');
  } else if (request.url === '/username') {
    response.write('tim');
  } else if (request.url === '/api') {
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ data: students }));
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ error: 'url not found' }));
  }
  response.end();
});

server.listen(4000, (err) => {
  if (err) {
    console.error('something went wrong', err);
    return;
  }
  console.log('Server running on port 4000');
});
