'use strict';

var Alexa = require("alexa-sdk"); // Using the Alexa Skills SDK here: https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs for easier development.
var google = require('googleapis');
var appId = 'amzn1.ask.skill.ec6a00b8-d2d3-4aaa-8ec9-470c6f149202';
var listEventsFunction = require('./listEventsFunction.js');
var authorise = require('./google/authorise.js');
var listNextEvent = require('./listNextEvent.js');
var removeEvent = require('./removeEvent.js');
var logEvent = require('./logEvent.js');

// Handles incoming events
exports.handler = function(event, context) {
  logEvent(event);

  // Validate that this request originated from authorized source.
  if (event.session.application.applicationId !== appId) {
      console.log("The applicationIds don't match : " + event.session.application.applicationId + " and " + this._appId);
      throw "Invalid applicationId";
  }

  //Assign the Alexa-SDK object to the alexa variable and pass in event and context
  var alexa = Alexa.handler(event, context);
  alexa.appId = appId;
  //alexa.dynamoDBTableName = 'smartReminders';
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// Define the handlers for dealing with intents.
var handlers = {
    'LaunchRequest': function(){
      this.emit(':tell', 'Welcome to smart reminders.');
    },
    'UpdateMeIntent': function() {
      listEventsFunction(this.event, this);
    },
    'NextReminderIntent': function(){
      authorise(this.event.session.user.accessToken, listNextEvent, this);
    },
    'CancelEvent': function(){
      authorise(this.event.session.user.accessToken, removeEvent, this);
    },
    'ModifyEvent': function(){
      logEvent(this.event.request.intent.slots);
      this.emit(':tell', 'Modify Intent Event');
    },
    'Unhandled': function(){
      this.emit(':tell', 'Thank you for using Smart Reminders.');
    }
};
