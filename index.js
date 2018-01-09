const http = require('http');
const fs = require('fs');

function readFile(filePath, fileContentType, response) {
  fs.readFile(filePath, (error, data) => {
    response.writeHeader(200, { 'Content-Type': fileContentType });
    response.end(data);
  });
}

http.createServer((request, response) => {
  const requestUrl = request.url;

  switch (requestUrl) {
    case '/app.css':
      readFile(`${__dirname}${requestUrl}`, 'text/css', response);
      break;
    default:
      readFile(`${__dirname}/index.html`, 'text/html', response);
  }
}).listen(process.env.PORT);
