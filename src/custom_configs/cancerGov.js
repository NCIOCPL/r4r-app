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

/**
 * The exitDisclaimer script in ContentPage on CGov will only run on the initial page load. That means
 * once the user starts navigating r4r, none of the typical injection scripts will rerun. Certain functionality may need ]
 * to be manually retriggered, or replicated. In this particular case, for simplicity's sake, I have replicated the
 * exitDisclaimer script (with more limited functionality since there are less edge cases) and will subscribe it to location
 * changes in the eventHandler.
 */
export const exitDisclaimerInjector = () => {
    // Cleanup all old disclaimers (simple approach)
    const extantDisclaimers = document.querySelectorAll('.r4r-container .icon-exit-notification');
    extantDisclaimers.forEach(node => {
        node.parentNode.removeChild(node);
    });

    // Find all external links
    const allLinks = document.querySelectorAll('.r4r-container a');
    const externalLinks = Array.from(allLinks).filter(link => {
        return /^https?:\/\/([a-zA-Z0-9-]+\.)+/i.test(link.href) 
                && !/^https?:\/\/([a-zA-Z0-9-]+\.)+gov/i.test(link.href) 
                    && link.href !== "";
    })
    
    // Replicate the disclaimer used on CGOV
    const disclaimerLink = document.createElement('a');
    disclaimerLink.classList.add('icon-exit-notification');
    disclaimerLink.title = 'Exit Disclaimer';
    disclaimerLink.href = "/policies/linking";
    const innerSpan = document.createElement('span');
    innerSpan.classList.add('hidden');
    innerSpan.innerText = 'Exit Notification';
    disclaimerLink.appendChild(innerSpan);

    // Attach clones 
    externalLinks.forEach(node => {
        node.parentNode.appendChild(disclaimerLink.cloneNode(true))
    });

    return externalLinks;
}

// Listen for changes to the location and rerun the exitDisclaimerInjector
export const exitDisclaimerEventHandler = (event) => {
    // TODO: This method of detecting location changes is temporary and will need to be rewritten
    // once the analytics middleware has been fleshed out.
    if(event.length === 2 && typeof event[1] === 'string'){
        console.log('Location change detected by exitDisclaimer listener')
        // The location change action event publishes before the dom is rerendered by React. We need a bit of a delay.
        // 100ms should be excessive.
        setTimeout(() => {
            exitDisclaimerInjector();
        }, 100)
    }
}

// Here is where we do the heavy lifting of processing events and passing them to
// the analytics library
export const createCancerGovAnalyticsHandler = analytics => (event) => {
    // TODO:
    // analytics(event); // this won't work as is since window.s is not actually a function on the site
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

    eventHandler.subscribe(exitDisclaimerEventHandler);

    awaitAnalyticsLibraryAvailability(eventHandler);
}

export default initializeCancerGovTheme;