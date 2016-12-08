// authorize.js
var GoogleAuth = require('google-auth-library');
var fs = require('fs');
var clientSecretsFile = 'client_secret.json';

// Purpose: To set the credentials from the client_secret.json and checks if the token is valid
// param(in): credentials: Authentication information of user from client_secret.json
// param(in):       token: The access token received from the lambda request and google
// param(in):    callback: A function that handles the error or returns the authentication information
module.exports = function authorize (token, callback, alexa) {
  fs.readFile(clientSecretsFile.toString(), function (err, content) {
    if (err) {
      console.log('Error Loading client secret file: ' + err);
      alexa.emit(':tell', 'There was an issue reaching the skill, please try again later');
    }
    var credentials = JSON.parse(content);
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.redirect_uris[0];
    var auth = new GoogleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    // Check if we have previously stored a token
    oauth2Client.setCredentials({
      access_token: token
    });
    if (token === undefined) {
      console.log('Token is undefined, please link the skill');
      alexa.emit(':tellWithLinkAccountCard', 'Please link Smart Reminders to your Google Account using the Alexa App');
      return;
    }
    return callback(oauth2Client, alexa);
  });
};
