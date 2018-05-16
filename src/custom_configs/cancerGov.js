// #########################################################################################
// #######¯\_(ツ)_/¯##### INTEGRATION / SHIM / PROXY / MIDDLEWARE ######¯\_(ツ)_/¯###########
// #########################################################################################

const apiEndpoint = 'https://r4rapi-blue-dev.cancer.gov/v1';

// CancerGov config object
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

    // If the cache isn't periodically emptied, it could fill up.
    // It might not be necessary to continue caching after the initial dump anyway. (Which would mean just never
    // never setting the isCaching flag back to true).
    const publishCache = listener => {
        isCaching = false;
        const queue = [ ...eventQueue ];
        eventQueue = [];
        queue.forEach(event => {
            listener(event);
        });
        isCaching = true;
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
    }

    return {
        onEvent,
        publish,
        publishCache,
        subscribe,
    }
}

export const createCancerGovAnalyticsHandler = analytics => (event) => {
    // Here is where we do the heavy lifting of processing events and passing them to
    // the analytics library
    // TODO:
    analytics(event);
}

export const subscribeToAnalyticsEvents = (analytics, eventHandler) => {
    const cancerGovAnalyticsHandler = createCancerGovAnalyticsHandler(analytics);
    // Pull the backlog of events
    eventHandler.publishCache(cancerGovAnalyticsHandler);
    // Going forward receive events in real-time
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

const initializeCancerGovTheme = initializeR4R => {
    const eventHandler = createEventHandler();

    // Start up r4r with custom settings
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