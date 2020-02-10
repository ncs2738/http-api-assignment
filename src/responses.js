const fs = require('fs'); 
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getResponse = (request, response, statusCode, contentType, content) => 
{
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

const getIndex = (request, response) =>
{
    getResponse(request, response, 200, 'text/html', index)
};

const getCSS = (request, response) =>
{
    getResponse(request, response, 200, 'text/css', css)
};

const success = (request, response, acceptedTypes) => 
{
    const responseObj = 
    {
        message: 'This is a successful response',
    };
    
    sendResponse(request, response, acceptedTypes, responseObj, 200);
};

const badRequest = (request, response, acceptedTypes, params) =>
{
    const responseObj = 
    {
        message: 'This request has the required parameters',
    };

    if (!params.valid || params.valid !== 'true') 
    {
        
        responseObj.message = 'Missing valid query parameter set to true';
        responseObj.id = 'badRequest';
        
        return sendResponse(request, response, acceptedTypes, responseObj, 400);
    }

    sendResponse(request, response, acceptedTypes, responseObj, 200);
};

const unauthorized = (request, response, acceptedTypes, params) =>
{
    const responseObj = 
    {
        message: 'You have successfully viewed the content (wowie).',
    };

    if (!params.loggedIn || params.loggedIn !== 'yes') 
    {

        responseObj.message = 'Missing loggedIn query parameter set to yes';
        responseObj.id = 'unauthorized';

        return sendResponse(request, response, acceptedTypes, responseObj, 401);
    }

    sendResponse(request, response, acceptedTypes, responseObj, 200);
};

const forbidden = (request, response, acceptedTypes) => 
{
    const responseObj = 
    {
        message: 'You do not have access to this content',
        id: 'forbidden',
    };

    sendResponse(request, response, acceptedTypes, responseObj, 403);
};

const internal = (request, response, acceptedTypes) =>
{
    const responseObj = 
    {
        message: 'Internal Server Error. Something went wrong',
        id: 'internalError',
    };

    sendResponse(request, response, acceptedTypes, responseObj, 500);
};

const notImplemented = (request, response, acceptedTypes) =>
{
    const responseObj = 
    {
        message: 'A get request for this page has not been implemented yet. Check again later (haha that is never happening) for updated content',
        id: 'notImplemented',
    };

    sendResponse(request, response, acceptedTypes, responseObj, 501);
};

const notFound = (request, response, acceptedTypes) =>
{
    const responseObj = 
    {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    sendResponse(request, response, acceptedTypes, responseObj, 404);
};

const sendResponse = (request, response, acceptedTypes, responseObj, statusCode) =>
{
    if (acceptedTypes[0] === 'text/xml') 
    {
        let responseXML = '<response>';
        responseXML = `${responseXML} <message>${responseObj.message}</message>`;
        if(responseObj.id) responseXML = `${responseXML} <id>${responseObj.id}</id>`;
        responseXML = `${responseXML} </response>`;
    
        return getResponse(request, response, statusCode, 'text/xml', responseXML);
    }

    const message = JSON.stringify(responseObj);
    getResponse(request, response, statusCode, 'application/json', message);
};

module.exports = 
{
    getIndex,
    getCSS,
    success,
    badRequest,
    unauthorized,
    forbidden,
    internal,
    notImplemented,
    notFound,
};
