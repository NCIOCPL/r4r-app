// Here is where we do the heavy lifting of processing events and passing them to
// the analytics library
export const createCancerGovAnalyticsHandler = analytics => (event) => {
    // TODO: FINISH THE REST OF THE FUCKING OWL
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