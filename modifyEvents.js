// listFiles.js
var google = require('googleapis');

// Purpose: To list five upcoming events in your google calendar
// param(in):     auth: Authentication information of user
// param(in): callback: A function that handles the error or returns the names of the files that were last edited
module.exports = function modifyEvents (auth, alexa) {
  var service = google.calendar('v3');

  var eventToModify = service.events.get({
      auth: auth,
      calendarId: 'primary',
      eventId: alexa.attributes['ID']
    }, function (err, response) {
      if (err) {
        console.log(err);
        return;
      }

      var event = response;
      var eventTime = new Date(event.start.dateTime);
      var newHours = alexa.event.request.intent.slots.time.value.split(':')[0];
      var newMinutes = alexa.event.request.intent.slots.time.value.split(':')[1];

      eventTime.setUTCHours(newHours, newMinutes);

      event.start.dateTime = eventTime.toISOString();

      console.log(event);


      alexa.emit(':tell', 'Check the logs');
    });
  };
