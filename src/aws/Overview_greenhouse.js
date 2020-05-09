var http = require('http');
var light;
var temp;
var humi;

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
    let speechOutput;
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = "How can I help you?";
    const shouldEndSession = true;
    
    var bodyLight = '';
	http.get({
		host: '188.166.206.43',
		path: '/EZ-cLj6AOgE6hIwDmCnu-pAthHxCk27N/get/v0',
		port: ''
	}, function(response) {
		// Continuously update stream with data
		response.on('data', function(d) {
			bodyLight += d;
		});
		response.on('end', function() {
			// Data reception is done, do whatever with it!
			console.log(bodyLight);
			light = parseFloat(bodyLight.slice(2, -2));
		});
	});
    
    var bodyTemp = '';
	http.get({
		host: '188.166.206.43',
		path: '/cDisL7jul9M50iYaozvzcf83Sa4Tb8QQ/get/v0',
		port: ''
	}, function(response) {
		// Continuously update stream with data
		response.on('data', function(d) {
			bodyTemp += d;
		});
		response.on('end', function() {
			// Data reception is done, do whatever with it!
			console.log(bodyTemp);
			temp = parseFloat(bodyTemp.slice(2, -2));
		});
	});
	
	var bodyHumi = '';
	http.get({
		host: '188.166.206.43',
		path: '/cDisL7jul9M50iYaozvzcf83Sa4Tb8QQ/get/v1',
		port: ''
	}, function(response) {
		// Continuously update stream with data
		response.on('data', function(d) {
			bodyHumi += d;
		});
		response.on('end', function() {
			// Data reception is done, do whatever with it!
			console.log(bodyHumi);
			humi = parseFloat(bodyHumi.slice(2, -2));
		});
	});
	

    speechOutput = "Light is " + light + " lux, Temperature is " + temp + "°C, Humidity is " + humi + "%";
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createTemperatureAttributes(temperature) {
    return {
        temperature: temperature
    };
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'OK. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
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
    if (intentName === 'AMAZON.HelpIntent') {
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