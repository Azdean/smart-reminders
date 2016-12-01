// listFiles.js
var google = require('googleapis');

// Purpose: To list five upcoming events in your google calendar
// param(in):     auth: Authentication information of user
// param(in): callback: A function that handles the error or returns the names of the files that were last edited
module.exports = function listEvents (auth, callback) {
  var service = google.calendar('v3');

  service.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 5,
    singleEvents: true,
    orderBy: 'startTime'
  }, function (err, response) {
    if (err) {
      var apiError = 'The API returned an error: ' + err;
      callback(apiError);
      return;
    }
    var events = response.items;
    if (events.length === 0) {
      var noEvents = 'No events.';
      callback(noEvents);
    } else {
      callback(null, events);
    }
  });
};
