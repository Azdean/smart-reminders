var fs = require('fs');
var listEvents = require('./google/listEvents.js');
var authorise = require('./google/authorise.js');
var clientSecretsFile = 'client_secret.json';

module.exports = listEventsFunction;

function listEventsFunction(event, alexa) {
  var accessToken = event.session.user.accessToken;
  if(typeof accessToken !== 'string'){
    console.log('AccessToken issue: ' + (typeof accessToken) + ' ' + accessToken);
    alexa.emit(':tellWithLinkAccountCard', 'Please link Smart Reminders to your Google Account using the Alexa App');
  }

  // Read client_secret.json file for data required for api authorisation
  fs.readFile(clientSecretsFile.toString(), function processClientSecrets (err, content) {
    if (err) {
      console.log('Error Loading client secret file: ' + err);
      alexa.emit(':tell', 'There was an issue reaching the skill, please try again later');
    } else {
      authorise(JSON.parse(content), accessToken, function (err, oauthClient) {
        if (err) {
          console.log(err);
          alexa.emit(':tellWithLinkAccountCard', 'Please link Smart Reminders to your Google Account using the Alexa App');
        }
        listEvents(oauthClient, function (err, events) {
            var eventNames = 'Here is your list of Events: ';
            if (err) {
              alexa.emit(':tell', err);
              return;
            }
            var DateObject = new Date();
            for (var i = 0; i < events.length; i++) {
              var event = events[i];
              var start = event.start.dateTime || event.start.date;
              var date =  DateObject.parse(start);

              eventNames += 'On the ' + date.getDate() + ' ' + date.getMonth + ' ' + event.summary;
            }
            alexa.emit(':tell', eventNames);
            return;
        });
      });
    }
  });
}
