var fs = require('fs');
var listNextEvent = require('./google/listNextEvent.js');
var authorise = require('./google/authorise.js');
var clientSecretsFile = 'client_secret.json';

module.exports = listNextEventFunction;

function listNextEventFunction(event, alexa) {
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
        listNextEvent(oauthClient, function (err, events) {
            var eventNames = 'Your next reminder is at : <break time="0.3s" />';
            if (err) {
              alexa.emit(':tell', err);
              return;
            }

            var month = {
              0: 'January',
              1: 'February',
              2: 'March',
              3: 'April',
              4: 'May',
              5: 'June',
              6: 'July',
              7: 'August',
              8: 'September',
              9: 'October',
              10: 'November',
              11: 'December'
            };

            for (var i = 0; i < events.length; i++) {
              var event = events[i];
              var start = event.start.dateTime || event.start.date;
              var date =  new Date(start);
              console.log(event);

              eventNames +=  date.toLocaleTimeString() + '<break time="0.2s" />' + event.summary;
            }
            alexa.emit(':tell', eventNames);
            return;
        });
      });
    }
  });
}
