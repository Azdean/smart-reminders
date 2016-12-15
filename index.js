'use strict';

var Alexa = require("alexa-sdk"); // Using the Alexa Skills SDK here: https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs for easier development.
var google = require('googleapis');
var appId = 'amzn1.ask.skill.ec6a00b8-d2d3-4aaa-8ec9-470c6f149202';
var listEvents = require('./listEvents.js');
var authorise = require('./google/authorise.js');
var listNextEvent = require('./listNextEvent.js');
var removeEvent = require('./removeEvent.js');
var modifyEvent = require('./modifyEvents.js');
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
  alexa.registerHandlers(handlers, askHandlers);
  alexa.execute();
};

var states = {
  ASK: '_ASK'
};

// Define the handlers for dealing with intents.
var handlers = {
    'LaunchRequest': function(){
      this.emit(':tell', 'Welcome to smart reminders.');
    },
    'UpdateMeIntent': function() {
      authorise(this.event.session.user.accessToken, listEvents, this);
    },
    'NextReminderIntent': function(){
      authorise(this.event.session.user.accessToken, listNextEvent, this);
    },
    'Unhandled': function(){
      this.handler.state = '';
      this.emit(':tell', 'Sorry I didnt catch that');
    }
};

var askHandlers = Alexa.CreateStateHandler(states.ASK, {
  'CancelEvent': function(){
    this.handler.state = '';
    authorise(this.event.session.user.accessToken, removeEvent, this);
  },
  'ModifyEvent': function(){
    this.handler.state = '';
    logEvent(this.event.request.intent.slots);
    authorise(this.event.session.user.accessToken, modifyEvent, this);
  },
  'SessionEndedRequest': function(){
    this.handler.state = '';
    logEvent('Session Ended');
  },
  'Unhandled': function(){
    this.handler.state = '';
    this.emit(':tell', 'Thank you for using Smart Reminders.');
  }
});
