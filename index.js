'use strict';

// Using the Alexa Skills SDK here: https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs for easier development.
var Alexa = require("alexa-sdk");
const APP_ID = 'amzn1.ask.skill.c5b422b7-9f76-4474-82ad-69b79e80afaf';
// Handles incoming events
exports.handler = function(event, context, callback) {

    // Validate that this request originated from authorized source.
    if (event.session.application.applicationId !== APP_ID) {
        console.log("The applicationIds don't match : " + event.session.application.applicationId + " and "
            + this._appId);
        throw "Invalid applicationId";
    }

    //Assign the Alexa-SDK object to the alexa variable and pass in event and context
    var alexa = Alexa.handler(event, context);
    // Register our handlers to the Alexa object
    alexa.registerHandlers(handlers);
    // Execute the event using the handlers
    alexa.execute();
};

/*
  Define the handlers for dealing with events using the following structure:
  'intentname' : function(){
    code goes here
    this.emit('output');
  }
*/
var handlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'HelloWorldIntent': function () {
        this.emit('SayHello')
    },
    'DateIntent': function () {
      var date = new Date();
      var month = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
      };

      this.emit(':tell', 'The date is ' + date.getDate() + ' of ' + month[date.getMonth()] + ' ' + date.getFullYear() );
    },
    'SayHello': function () {
        this.emit(':tell', 'Hello Azzdeen!');
    }
};
