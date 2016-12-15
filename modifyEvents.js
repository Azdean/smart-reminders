// listFiles.js
var google = require('googleapis');

// Purpose: To list five upcoming events in your google calendar
// param(in):     auth: Authentication information of user
// param(in): callback: A function that handles the error or returns the names of the files that were last edited
module.exports = function modifyEvents (auth, alexa) {
  var service = google.calendar('v3');

  console.log(alexa.attributes['ID']);

  service.events.get({
      auth: auth,
      calendarId: 'primary',
      eventId: alexa.attributes['ID']
    }, function (err, response) {
      if (err) {
        console.log(err);
        return;
      }

      if(response.recurringEventId){
        service.events.instances({
          auth: auth,
          calendarId: 'primary',
          eventId: response.recurringEventId,
          maxResults: 10
        }, function(err, response) {
            var events = response.items;

            var errorFlag = false;
            for(var i=0; i < events.length; i++){
              var event = events[i];

              var eventStartTime = new Date(event.start.dateTime);
              var eventEndTime = new Date(event.end.dateTime);
              var timeDifference =   eventEndTime.getTime() - eventStartTime.getTime();

              var newHours = alexa.event.request.intent.slots.time.value.split(':')[0];
              var newMinutes = alexa.event.request.intent.slots.time.value.split(':')[1];

              eventStartTime.setUTCHours(newHours, newMinutes);
              eventEndTime.setTime((eventStartTime.getTime() + timeDifference));

              event.start.dateTime = eventStartTime.toISOString();
              event.end.dateTime = eventEndTime.toISOString();

              service.events.update({
                  auth: auth,
                  calendarId: 'primary',
                  eventId: event.id,
                  resource: event
              }, function(err, response){
                if(err){
                 console.log(err);
                 errorFlag = true;
                }
              });
            }

            if(errorFlag){
              alexa.emit(':tell', 'Smart Reminders encountered an error, please try again later.');
            } else {
              alexa.emit(':tell', ('I have updated the reminder so that it reoccurs at <say-as interpret-as="time">' + alexa.event.request.intent.slots.time.value + '</say-as>'));
            }
          });
      } else {
        var event = response;
        var eventStartTime = new Date(event.start.dateTime);
        var eventEndTime = new Date(event.end.dateTime);
        var timeDifference =   eventEndTime.getTime() - eventStartTime.getTime();

        var newHours = alexa.event.request.intent.slots.time.value.split(':')[0];
        var newMinutes = alexa.event.request.intent.slots.time.value.split(':')[1];

        eventStartTime.setUTCHours(newHours, newMinutes);
        eventEndTime.setTime((eventStartTime.getTime() + timeDifference));

        event.start.dateTime = eventStartTime.toISOString();
        event.end.dateTime = eventEndTime.toISOString();

        console.log(event);


        service.events.update({
            auth: auth,
            calendarId: 'primary',
            eventId: alexa.attributes['ID'],
            resource: event
        }, function(err, response){
          if(err){
           console.log(err);
           alexa.emit(':tell', 'An error occured, please see the logs');
          }
          alexa.emit(':tell', ('I have updated the reminder so that it reoccurs at <say-as interpret-as="time">' + alexa.event.request.intent.slots.time.value + '</say-as>'));
        });
      }
    });
  };
