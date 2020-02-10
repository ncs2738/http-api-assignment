const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key:value object to look up URL routes to specific functions
const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success' : responseHandler.success,
  '/badRequest' : responseHandler.badRequest,
  '/unauthorized' : responseHandler.unauthorized,
  '/forbidden' : responseHandler.forbidden,
  '/internal' : responseHandler.internal,
  '/notImplemented' : responseHandler.notImplemented,
  '/notFound' : responseHandler.notFound,
  index: responseHandler.getIndex,
  notFound: responseHandler.notFound,
};

// handle HTTP requests. In node the HTTP server will automatically
// send this function request and pre-filled response objects.
const onRequest = (request, response) => {
    // parse the url using the url module
    // This will let us grab any section of the URL by name
    const parsedUrl = url.parse(request.url);
    
    // grab the query parameters (?key=value&key2=value2&etc=etc)
    // and parse them into a reusable object by field name
    const params = query.parse(parsedUrl.query);
  
    // grab the 'accept' headers (comma delimited) and split them into an array
    const acceptedTypes = request.headers.accept.split(',');


    // check if the path name (the /name part of the url) matches
    // any in our url object. If so call that function. If not, default to index.
    if (urlStruct[parsedUrl.pathname]) 
    {
      urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
    } 
    else
    {
        urlStruct.notFound(request, response, acceptedTypes, params);
    }
  };
  
  // start HTTP server
  http.createServer(onRequest).listen(port);
  
  console.log(`Listening on 127.0.0.1: ${port}`);