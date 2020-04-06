const Alexa = require('ask-sdk-core');
const i18n = require('i18next'); // i18n library dependency, we use it below in a localisation interceptor
const responses = require('./responses');
const fetch = require('node-fetch');

const SWAPI_URL = "https://swapi.co/api/";


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('WELCOME_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const FindPersonIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FindPersonIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;

        const person = Alexa.getSlotValue(requestEnvelope, 'person');
        const request = await fetch(`${SWAPI_URL}people?format=json&search=${person}`);
        const json = await request.json();

        let speakOutput = handlerInput.t('PERSON_NOT_FOUND_MSG', {name: person}); // Not found until proven otherwise

        if (json['results'].length > 0) {
            const personDetails = json['results'][0];

            speakOutput = handlerInput.t('PERSON_MSG', {
                name: personDetails['name'],
                height: personDetails['height'],
                weight: personDetails['mass'],
                gender: personDetails['gender'],
                skinColour: personDetails['skin_color'],
                eyeColour: personDetails['eye_color'],
                hairColour: personDetails['hair_color']
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true) // force the skill to close the session after confirming the birthday date
            .getResponse();
    }
};
const FindPlanetIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FindPlanetIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;

        const planet = Alexa.getSlotValue(requestEnvelope, 'planet');
        const request = await fetch(`${SWAPI_URL}planets?format=json&search=${planet}`);
        const json = await request.json();

        let speakOutput = handlerInput.t('PLANET_NOT_FOUND_MSG', {name: planet}); // Not found until proven otherwise

        if (json['results'].length > 0) {
            const planetDetails = json['results'][0];

            speakOutput = handlerInput.t('PLANET_MSG', {
                name: planetDetails['name'],
                population: planetDetails['population'],
                orbitalPeriod: planetDetails['orbital_period'],
                rotationPeriod: planetDetails['rotation_period']
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true) // force the skill to close the session after confirming the birthday date
            .getResponse();
    }
};
const FindSpeciesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FindSpeciesIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;

        const species = Alexa.getSlotValue(requestEnvelope, 'species');
        const request = await fetch(`${SWAPI_URL}species?format=json&search=${species}`);
        const json = await request.json();

        let speakOutput = handlerInput.t('SPECIES_NOT_FOUND_MSG', {name: species}); // Not found until proven otherwise

        if (json['results'].length > 0) {
            speciesDetails = json['results'][0];

            const speakOutput = handlerInput.t('SPECIES_MSG', {
                name: speciesDetails['name'],
                height: speciesDetails['height'],
                lifespan: speciesDetails['lifespan'],
                classification: speciesDetails['classification'],
                language: speciesDetails['language']
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true) // force the skill to close the session after confirming the birthday date
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', { intentName: intentName });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = handlerInput.t('ERROR_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


/**
 * This request interceptor will bind a translation function 't' to the handlerInput
 */
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: responses
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};

/**
* This request interceptor will log all incoming requests in the associated Logs (CloudWatch) of the AWS Lambda functions
*/
const LoggingRequestInterceptor = {
   process(handlerInput) {
       console.log("\n" + "********** REQUEST *********\n" +
           JSON.stringify(handlerInput, null, 4));
   }
};

/**
 * The SkillBuilder acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom.
 */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        FindSpeciesIntentHandler,
        FindPlanetIntentHandler,
        FindPersonIntentHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .addRequestInterceptors(
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor
    )
    .lambda();
