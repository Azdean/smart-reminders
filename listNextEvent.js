// listFiles.js
var google = require('googleapis');

// Purpose: To list five upcoming events in your google calendar
// param(in):     auth: Authentication information of user
// param(in): callback: A function that handles the error or returns the names of the files that were last edited
module.exports = function listEvents (auth, alexa) {
  var service = google.calendar('v3');
  var endOfDay = new Date;
  endOfDay.setHours(23, 59);

  service.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    timeMax: endOfDay.toISOString(),
    maxResults: 1,
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
      var noEvents = 'There are no reminders in your calendar for today.';
      buildResponse(alexa, noEvents);
    } else {
      buildResponse(alexa, null, events);
    }
  });
};

function buildResponse(alexa, err, events) {
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

    alexa.attributes['ID'] = event.id;
    eventNames +=  date.toLocaleTimeString() + '<break time="0.2s" />' + event.summary;
  }
  alexa.emit(':ask', (eventNames + '<break time="0.2s" />'), 'You can remove this reminder by saying, remove this event. <break time="0.2s" /> You can modify the event by saying, Modify this event.');
  return;
};
