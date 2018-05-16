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
};

// We need an eventHandler that is available before the analytics library and will
// queue events until then. Other libraries are free to subscribe to realtime events
// but in its current state, only one listener can access cached events.
export const createEventHandler = () => {
    let isCaching = true;
    let eventQueue = [];
    let listeners = [];

    const onEvent = (...args) => {
        if(isCaching){
            eventQueue = [...eventQueue, args];
        }
        publish(args);
    }

    // This is a one time use. Once the cache is dumped it stops receiving new events.
    const dumpCache = listener => {
        isCaching = false;
        const queue = [ ...eventQueue ];
        eventQueue = [];
        queue.forEach(event => {
            listener(event);
        });
    }

    const publish = event => {
        listeners.forEach(listener => listener(event));
    }

    const subscribe = listener => {
        let isSubscribed = true;
        listeners = [...listeners, listener];

        const unsubscribe = () => {
            if(!isSubscribed){
                return;
            }

            isSubscribed = false;
            listeners = listeners.filter(list => list !== listener);
        }

        return unsubscribe;
    }

    return {
        onEvent,
        publish,
        dumpCache,
        subscribe,
    }
}

// Here is where we do the heavy lifting of processing events and passing them to
// the analytics library
export const createCancerGovAnalyticsHandler = analytics => (event) => {
    // TODO:
    analytics(event);
}

// Once the analytics library is available, we want to first curry the analytics event listener (which does the heavy lifting
// of processing r4r events in a way that the analytics library like) with access to the analytics library. Henceforth it just
// receives new events, processes them, and passes them on.
// Once the analytics event listener is bound to the analytics library, it first recieves all the cached events in the
// proxy and then begins listening to future events in real time. 
export const subscribeToAnalyticsEvents = (analytics, eventHandler) => {
    const cancerGovAnalyticsHandler = createCancerGovAnalyticsHandler(analytics);
    eventHandler.dumpCache(cancerGovAnalyticsHandler);
    const unsubscribe = eventHandler.subscribe(cancerGovAnalyticsHandler);
    window.addEventListener('unload', unsubscribe);
}

// We want to make sure the analytics library is available before we subscribe it
// to the event handler proxy.
export const awaitAnalyticsLibraryAvailability = (eventHandler) => {
    const listener = () => {
        subscribeToAnalyticsEvents(window.s, eventHandler);
    }

    window.addEventListener('analytics_ready', listener);
    
    if(window.s){
        window.removeEventListener('analytics_ready', listener);
        subscribeToAnalyticsEvents(window.s, eventHandler);
    }
}

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

    awaitAnalyticsLibraryAvailability(eventHandler);
}

export default initializeCancerGovTheme;