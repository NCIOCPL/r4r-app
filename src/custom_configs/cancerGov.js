import createEventHandler from './cancer_gov/eventHandler';
import { awaitAnalyticsLibraryAvailability } from './cancer_gov/analyticsHandler';
import { exitDisclaimerEventHandler } from './cancer_gov/exitDisclaimerHandler';

// #########################################################################################
// #######¯\_(ツ)_/¯##### INTEGRATION / SHIM / PROXY / MIDDLEWARE ######¯\_(ツ)_/¯###########
// #########################################################################################

const apiEndpoint = 'https://r4rapi-blue-dev.cancer.gov/v1';

// Explicit CSS overrides from CGOV styles
const customTheme = {
    'r4r-container': 'row',
    'searchbar__container': 'cancer-gov',
    'searchbar__button--submit': 'button',
    'browse__tile': 'arrow-link',
    'similar-resource__tile': 'arrow-link',
    'view-all__link': 'arrow-link',
};

/**
 * A wrapper around the r4r library that creates a custom proxy and injects custom settings.
 * Finally a custom analytics event handler is created and subscribed to the proxy.
 * 
 * @param {function} initializeR4R 
 */
const initializeCancerGovTheme = initializeR4R => {
    const eventHandler = createEventHandler();

    initializeR4R({
        appId: 'r4r-browser-cache',
        customTheme,
        historyProps: {
            basename: '/research/r4r',
        },
        eventHandler: eventHandler.onEvent,
        apiEndpoint,
    });

    eventHandler.subscribe(exitDisclaimerEventHandler);

    awaitAnalyticsLibraryAvailability(eventHandler);
}

export default initializeCancerGovTheme;