var http = require('http');

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = "I'm here in your green house. How can I help you?"
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = "How can I help you?";
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'OK. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function createTemperatureAttributes(temperature) {
    return {
        temperature: temperature
    };
}

/**
 * Control light.
 */
function controlLightInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    // let speechOutput = "ok control light"
    let speechOutput = '';
	const shouldEndSession = false;
	speechOutput = "OK set light brightness to " + intent.slots.brightness.value + " lux";
    return new Promise((resolve, reject) => {
    const options = {
        host: '188.166.206.43',
        path: '/xLvGYq8nj_ROJdi_FMNjWSTO1ZpKMK_n/update/v0?value=' + intent.slots.brightness.value,
        port: 80,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve('Success');
      callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

    // send the request
    req.write('');
    req.end();
    });
    // callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Control pump.
 */
function controlPumpInSession(intent, session, callback) {
    let status;
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    let speechOutput = '';
	const shouldEndSession = false;
	speechOutput = "OK pump " + intent.slots.OnOff.value;
	if (intent.slots.OnOff.value == "on")
	{
	    status = 1;
	}
	if (intent.slots.OnOff.value == "off")
	{
	    status = 0;
	}
    return new Promise((resolve, reject) => {
    const options = {
        host: '188.166.206.43',
        path: '/au-BSHAwXAybrvtVoPLk0B2R0okr5aTK/update/v0?value=' + status,
        port: 80,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve('Success');
      callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

    // send the request
    req.write('');
    req.end();
    });
    // callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Control fan.
 */
function controlFanInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    let speechOutput = '';
	const shouldEndSession = false;
	speechOutput = "OK turn on fan when temperature over " + intent.slots.temp.value + "°C";
    return new Promise((resolve, reject) => {
    const options = {
        host: '188.166.206.43',
        path: '/a17t7bcSz-220nbpwZR-rIC13AvSJsWL/update/v0?value=' + intent.slots.temp.value,
        port: 80,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve('Success');
      callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

    // send the request
    req.write('');
    req.end();
    });
    // callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Control mist.
 */
function controlMistInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    let speechOutput = '';
	const shouldEndSession = false;
	speechOutput = "OK turn on humidifier when humidity is less than " + intent.slots.humi.value + "%";
    return new Promise((resolve, reject) => {
    const options = {
        host: '188.166.206.43',
        path: '/XDxuyhKerygWslUd7R9h36XGzUbo5gNi/update/v0?value=' + intent.slots.humi.value,
        port: 80,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve('Success');
      callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

    // send the request
    req.write('');
    req.end();
    });
    // callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Read light in the session and prepares the speech to reply to the user.
 */
function readLightInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    let speechOutput = '';
	var body = '';
	const shouldEndSession = false;
    // callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
	//Update
	var httpPromise = new Promise( function(resolve,reject){
		http.get({
			host: '188.166.206.43',
			path: '/EZ-cLj6AOgE6hIwDmCnu-pAthHxCk27N/get/v0',
			port: ''
		}, function(response) {
			// Continuously update stream with data
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {
				// Data reception is done, do whatever with it!
				console.log(body);
				resolve('Done Sending');
			});
		});
	});
	httpPromise.then(
		function(data) {
			var info = JSON.parse(body);
			console.log('Function called succesfully:', data);
			sessionAttributes = createTemperatureAttributes(info.temperature);
			speechOutput = "Light is " + parseFloat(body.slice(2, -2)) + " lux";
			console.log(speechOutput);
			callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
		},
		function(err) {
			console.log('An error occurred:', err);
		}
	);
}

/**
 * Read temperature in the session and prepares the speech to reply to the user.
 */
function readTemperatureInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    let speechOutput = '';
	var body = '';
	const shouldEndSession = false;
    // callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
	//Update
	var httpPromise = new Promise( function(resolve,reject){
		http.get({
			host: '188.166.206.43',
			path: '/cDisL7jul9M50iYaozvzcf83Sa4Tb8QQ/get/v0',
			port: ''
		}, function(response) {
			// Continuously update stream with data
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {
				// Data reception is done, do whatever with it!
				console.log(body);
				resolve('Done Sending');
			});
		});
	});
	httpPromise.then(
		function(data) {
			var info = JSON.parse(body);
			console.log('Function called succesfully:', data);
			sessionAttributes = createTemperatureAttributes(info.temperature);
			speechOutput = "Temperature is " + parseFloat(body.slice(2, -2)) + "°C";
// 			repromptText = "Temperature is " + info.temperature + "°C. Humidity is " + info.humidity + "%";
			console.log(speechOutput);
			callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
		},
		function(err) {
			console.log('An error occurred:', err);
		}
	);

}

/**
 * Read humidity in the session and prepares the speech to reply to the user.
 */
function readHumiInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    let speechOutput = '';
	var body = '';
	const shouldEndSession = false;
    // callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
	//Update
	var httpPromise = new Promise( function(resolve,reject){
		http.get({
			host: '188.166.206.43',
			path: '/cDisL7jul9M50iYaozvzcf83Sa4Tb8QQ/get/v1',
			port: ''
		}, function(response) {
			// Continuously update stream with data
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {
				// Data reception is done, do whatever with it!
				console.log(body);
				resolve('Done Sending');
			});
		});
	});
	httpPromise.then(
		function(data) {
			var info = JSON.parse(body);
			console.log('Function called succesfully:', data);
			sessionAttributes = createTemperatureAttributes(info.temperature);
			speechOutput = "Humidity is " + parseFloat(body.slice(2, -2)) + "%";
			console.log(speechOutput);
			callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
		},
		function(err) {
			console.log('An error occurred:', err);
		}
	);

}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}");
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}");

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}");

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'temperature') {
        readTemperatureInSession(intent, session, callback);
    } else if (intentName === 'light') {
        readLightInSession(intent, session, callback);
    } else if (intentName === 'humidity') {
        readHumiInSession(intent, session, callback);
    } else if (intentName === 'lightControl') {
        controlLightInSession(intent, session, callback);
    } else if (intentName === 'fanControl') {
        controlFanInSession(intent, session, callback);
    } else if (intentName === 'pumpControl') {
        controlPumpInSession(intent, session, callback);
    } else if (intentName === 'mistControl') {
        controlMistInSession(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}");
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context) => {
    try {
        console.log("event.session.application.applicationId=${event.session.application.applicationId}");

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
					context.succeed(buildResponse(sessionAttributes, speechletResponse));
				});
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
					context.succeed(buildResponse(sessionAttributes, speechletResponse));
				});
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};