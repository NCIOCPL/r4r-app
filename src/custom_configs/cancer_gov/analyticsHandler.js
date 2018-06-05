const loadSearchPage = event => {
    return {
        prop1: event.meta.location.href.slice(0, 100),
        prop2: event.meta.location.href.slice(100) ? event.meta.location.href.slice(100) : '',
        prop6: 'Resources for Researchers Search Results',
        prop8: 'english',
    }
}

const loadResourcePage = event => {
    return {
        prop1: event.meta.location.href.slice(0, 100),
        prop2: event.meta.location.href.slice(100) ? event.meta.location.href.slice(100) : '',
        prop6: event.payload.title,
        prop8: 'english',
    }
}

const loadHomePage = event => {
    return {
        prop1: event.meta.location.href.slice(0, 100),
        prop2: event.meta.location.href.slice(100) ? event.meta.location.href.slice(100) : '',
        prop6: event.payload.title,
        prop8: 'english',
    }
}

const clickEvent = event => {
    switch(event.meta.clickType){
        case 'View All':
            return {
                prop1: event.meta.clickType,
                prop2: event.meta.clickInfo ? event.meta.clickInfo.page : '',
                prop67: event.meta.location.href,
            }
        case 'Search BTN': 
            return {
                prop67: event.meta.location.href,
                prop1: event.meta.clickType,
                prop2: event.meta.clickInfo.keyword,

            }
        case 'Resource Result':
            return {
                prop1: event.meta.clickType,
                prop45: event.meta.clickInfo.localIndex + event.meta.clickInfo.resultsFrom,
                prop49: event.meta.clickInfo.totalResults,
                prop67: event.meta.location.href,
            }
        default:
            return {};
    }
}


const analyticsEvents = {
    'LOAD NEW SEARCH RESULTS': loadSearchPage,
    'LOAD NEW FACET RESULTS': loadHomePage,
    'LOAD RESOURCE': loadResourcePage,
    '@@event/APP_INITIALIZATION': () => ({}),
    '@@event/CLICK': clickEvent,
}

const analyticsEventsMap = new Map(Object.entries(analyticsEvents));

// Here is where we do the heavy lifting of processing events and passing them to
// the analytics library
export const createCancerGovAnalyticsHandler = analytics => events => {
    // TODO: FINISH THE REST OF THE FUCKING OWL
    events.map(event => {
        if(analyticsEventsMap.has(event.type)){
            const process = analyticsEventsMap.get(event.type);
            const report = process(event)
            analytics(report); // This could be an event broadcaster or the analytics library itself
        }
        return event;
    })
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

    if(process.env.NODE_ENV !== 'development'){
        window.addEventListener('analytics_ready', listener);

        if(window.s){
            window.removeEventListener('analytics_ready', listener);
            subscribeToAnalyticsEvents(window.s, eventHandler);
        }
    }
    else {
        subscribeToAnalyticsEvents((report) => { console.log('Analytics', report)}, eventHandler);
    }
    
}