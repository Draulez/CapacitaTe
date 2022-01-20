
// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

module.exports = {


LoggingRequestInterceptor: {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
},


LoggingResponseInterceptor: {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
},

 // This request interceptor will bind a translation function 't' to the requestAttributes.
    // Additionally it will handle picking a random value if instead of a string it receives an array
    LocalizationRequestInterceptor: {
        process(handlerInput) {
            const localizationClient = i18n.use(sprintf).init({
                lng: handlerInput.requestEnvelope.request.locale,
                resources: require('./language'),
            });
            localizationClient.localize = function localize() {
                const args = arguments;
                const values = [];
                for (let i = 1; i < args.length; i += 1) {
                    values.push(args[i]);
                }
                const value = i18n.t(args[0], {
                    returnObjects: true,
                    postProcess: 'sprintf',
                    sprintf: values,
                });
                if (Array.isArray(value)) {
                    return value[Math.floor(Math.random() * value.length)];
                }
                return value;
            };
            const attributes = handlerInput.attributesManager.getRequestAttributes();
            attributes.t = function translate(...args) {
                return localizationClient.localize(...args);
            }
        }
    }
}
