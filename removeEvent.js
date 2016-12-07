// listFiles.js
var google = require('googleapis');
var logEvent = require('./logEvent.js');

// Purpose: To list five upcoming events in your google calendar
// param(in):     auth: Authentication information of user
// param(in): callback: A function that handles the error or returns the names of the files that were last edited
module.exports = function removeEvent (auth, alexa) {
  var service = google.calendar('v3');
  var lastEventID = alexa.attributes['ID'];

  service.events.delete({
    auth: auth,
    calendarId: 'primary',
    eventId: lastEventID
  }, function (err, response) {
    if (err) {
      var apiError = 'The API returned an error: ' + err;
      logEvent(apiError);
      alexa.emit(':tell', 'Smart Reminders has encountered an error.');
      return;
    } else {
        logEvent(('Removed GOOGLE EVENT ID = ' + lastEventID));
        alexa.emit(':tell', 'Reminder has been successfully removed');
    }
  });
};
