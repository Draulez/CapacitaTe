// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const interceptors = require('./interceptors');
const moment = require('moment-timezone');
moment.locale('es');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const nombre = sessionAttributes['nombre'];

        let speakOutput;

        if(nombre)
        speakOutput = requestAttributes.t('BIENVENIDA2_MSG', nombre);
        else
        speakOutput = requestAttributes.t('BIENVENIDA_MSG');


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const BuenosDiasIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BuenosDiasIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope, responseBuilder, attributesManager} = handlerInput;
        const {intent} = requestEnvelope.request;
        const requestAttributes = attributesManager.getRequestAttributes();


        const timezone = 'Europe/Madrid';
        const formato = 'dddd';
        const diaSemanaMoment = moment().format(formato);
        
        const diaSemana = Alexa.getSlotValue(requestEnvelope, 'diaSemana');

        let speakOutput;

        if (diaSemana == diaSemanaMoment)
        speakOutput = requestAttributes.t('PREGUNTA1_CORRECTA');
        else
        speakOutput = requestAttributes.t('PREGUNTA1_INCORRECTA', diaSemanaMoment);
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'PreguntaDosIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt(speakOutput)
            .getResponse();
    }
};

const PreguntaDosIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaDosIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope, responseBuilder, attributesManager} = handlerInput;
        const {intent} = requestEnvelope.request;
        const requestAttributes = attributesManager.getRequestAttributes();


        const timezone = 'Europe/Madrid';
        const diaMesMoment = moment().format('D');
        const mesMoment = moment().format('MMMM');
        const anyoMoment = moment().format('YYYY');
        
        const diaMes = Alexa.getSlotValue(requestEnvelope, 'diaMes');
        const mes = Alexa.getSlotValue(requestEnvelope, 'mes');
        const anyo = Alexa.getSlotValue(requestEnvelope, 'anyo');

        let speakOutput = "";

        if(diaMesMoment != diaMes)
            speakOutput = requestAttributes.t('PREGUNTA2_INCORRECTA1', diaMesMoment);
        if(mesMoment != mes)
            speakOutput = speakOutput + requestAttributes.t('PREGUNTA2_INCORRECTA2', mesMoment);
        if(anyoMoment != anyo)
            speakOutput = speakOutput + requestAttributes.t('PREGUNTA2_INCORRECTA3', anyoMoment);
        if(speakOutput === "")
            speakOutput = requestAttributes.t('PREGUNTA2_CORRECTA', anyoMoment);

           // speakOutput = "Algo";
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDelegateDirective({
                name: 'PreguntaTresIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};

const PreguntaTresIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaTresIntent';
    },
    handle(handlerInput) {
        
        const {requestEnvelope, responseBuilder, attributesManager} = handlerInput;
        const {intent} = requestEnvelope.request;
        const requestAttributes = attributesManager.getRequestAttributes();

        const clima = Alexa.getSlotValue(requestEnvelope, 'clima');

        let speakOutput = requestAttributes.t('PREGUNTA4', clima);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .addDelegateDirective({
                name: 'PreguntaCuatroIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};

const PreguntaCuatroIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaCuatroIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope, responseBuilder, attributesManager} = handlerInput;
        const {intent} = requestEnvelope.request;
        const requestAttributes = attributesManager.getRequestAttributes();

        const estadoAnimo = Alexa.getSlotValue(requestEnvelope, 'estadoAnimo');

        let speakOutput;

        switch (estadoAnimo) {
            case "enfadado":
                speakOutput = requestAttributes.t('ANIMO_ENFADADO');
                break;
            case "contento":
                speakOutput = requestAttributes.t('ANIMO_CONTENTO');
                break;
            case "triste":
                speakOutput = requestAttributes.t('ANIMO_TRISTE');
                break;
            default:
                speakOutput = requestAttributes.t('ANIMO_COMODIN');
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const RegistrarDatosIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegistrarDatosIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope, responseBuilder, attributesManager} = handlerInput;
        const {intent} = requestEnvelope.request;
        const requestAttributes = attributesManager.getRequestAttributes();

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const nombre = Alexa.getSlotValue(requestEnvelope, 'nombre');
        const diaNac = Alexa.getSlotValue(requestEnvelope, 'diaNac');
        const mesNac = Alexa.getSlotValue(requestEnvelope, 'mesNac');
        const anyoNac = Alexa.getSlotValue(requestEnvelope, 'anyoNac');

        /*sessionAttributes['nombre'] = nombre;
        sessionAttributes['diaNac'] = diaNac;
        sessionAttributes['mesNac'] = mesNac;
        sessionAttributes['anyoNac'] = anyoNac;
        */

        let speakOutput = requestAttributes.t('REGISTRO_MSG', nombre, diaNac, mesNac, anyoNac);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
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
        const speakOutput = 'Goodbye!';
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

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        BuenosDiasIntentHandler,
        PreguntaDosIntentHandler,
        PreguntaTresIntentHandler,
        PreguntaCuatroIntentHandler,
        RegistrarDatosIntent,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        )
    .addRequestInterceptors(
        interceptors.LocalizationRequestInterceptor,
        interceptors.LoggingRequestInterceptor
    )
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor
    )
    .addErrorHandlers(
        ErrorHandler,
        )
    .lambda();
