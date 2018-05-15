import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './state';
import Router from './Router';
import ErrorBoundary from './ErrorBoundary';
import FatalErrorBoundary from './FatalErrorBoundary';
import LiveRegion from './LiveRegion';
import { Helmet } from 'react-helmet';
import { loadStateFromSessionStorage, saveStatetoSessionStorage } from './cache';
import { createTheme, ThemeProvider, Theme } from './theme';
import { createBrowserHistory } from 'history';
import createEventReporterMiddleware from './state/middleware/eventReporter';
import timestampMiddleware from './state/middleware/timestamp';


// Remove this block after CGOV custom theme development is complete
if(process.env.NODE_ENV !== 'production') {
    import('./cancergov_styles/nvcg.css');
    import('./cancergov_styles/InnerPage.css');
    import('./cancergov_styles/r4r_cgov_theme.css');
}

/**
 * @param {object} [config]
 * @param {string} [config.appId = 'DEFAULT_APP_ID'] the id used by the app for sessionStorage
 * @param {string} [config.rootId = 'r4r-root] the id of the dom node for the app to attach to
 * @param {object} [config.theme = {}] a hashmap where key = r4r default classname and custom classname to inject alongside it (or else default)
 * @returns {Node} The DOM node to which the app is hooked
 */
const initialize = ({
    customTheme = {},
    appId = 'DEFAULT_APP_ID',
    rootId = 'r4r-root',
    historyProps = {},
    eventHandler,
    apiEndpoint = 'https://r4rapi-blue-dev.cancer.gov/v1',
} = {}) => {

    if(typeof customTheme !== 'object' || customTheme === null) {
        throw new Error('customTheme must be a non-null object')
    }
    const theme = createTheme(customTheme);

    let cachedState;
    if(process.env.NODE_ENV !== 'development') {
        cachedState = loadStateFromSessionStorage(appId);
    }

    /**
     * By instantiating our history object here, instead of using BrowserRouter which is a wrapper around Router 
     * and the history API setup, we can have access to it outside of the component
     * tree (especially in our thunks to allow redirecting after searches (this would otherwise be impossible)).
     * In this case we are passing it as a third argument in our thunks (dispatch, getState, history)
     */
    const history = createBrowserHistory(historyProps);

    if(eventHandler){
        history.listen((location, action) => {
            eventHandler(location, action);
        })
    }

    const eventReporterMiddleware = createEventReporterMiddleware(eventHandler);

    const store = createStore(
        combineReducers(reducers),
        cachedState,
        composeWithDevTools(applyMiddleware(
            thunk.withExtraArgument({
                history,
                apiEndpoint,
            }),
            eventReporterMiddleware,
            timestampMiddleware,
        ))
    );

    if(process.env.NODE_ENV !== 'development') {
        const saveDesiredStateToSessionStorage = () => {
            const allState = store.getState();
            // No need to store ARIA-LIVE info or error to session storage
            const { announcements, error, ...state } = allState;
            saveStatetoSessionStorage({
                state,
                appId,
            });
        };
    
        store.subscribe(saveDesiredStateToSessionStorage);
    }

    const App = () => (
        <FatalErrorBoundary>
            <Provider store={ store }>
                    <ThemeProvider theme={ theme }>
                        <Theme element='main' className="r4r-container">
                            <ErrorBoundary>
                                <Helmet 
                                    defaultTitle="Resources for Researchers - National Cancer Institute"
                                >
                                    <meta name="description" content="Resources for Researchers is a tool to give researchers a better understanding of the various tools available to them." />
                                    <meta property="twitter:title" content="Resources for Researchers - National Cancer Institute" />
                                </Helmet>
                                <LiveRegion />
                                <Router history={ history }/>
                            </ErrorBoundary>
                        </Theme>
                    </ThemeProvider>
            </Provider>
        </FatalErrorBoundary>
    );
    const appRootDOMNode = document.getElementById(rootId);
    ReactDOM.render(<App />, appRootDOMNode);
    return appRootDOMNode;
}

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
// queue events until then.
const createEventHandler = () => {
    let isCaching = true;
    let eventQueue = [];
    let listeners = [];

    const onEvent = (...args) => {
        if(isCaching){
            eventQueue = [...eventQueue, args];
        }
        publish(args);
    }

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
        listeners = [...listeners, listener]

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

const createCancerGovAnalyticsHandler = analytics => (event) => {
    // Here is where we do the heavy lifting of processing events and passing them to
    // the analytics library
    analytics(event);
}

const subscribeToAnalyticsEvents = (analytics, eventHandler) => {
    const cancerGovAnalyticsHandler = createCancerGovAnalyticsHandler(analytics);
    eventHandler.publishCache(cancerGovAnalyticsHandler);
    const unsubscribe = eventHandler.subscribe(cancerGovAnalyticsHandler);
    window.addEventListener('unload', unsubscribe);
}

///////// STUFF HAPPENS HERE WHEN THE PAGE LOADS

document.addEventListener('DOMContentLoaded', () => {
    // This is the generic pub/sub intermediary. It should be built to be extensible
    const eventHandler = createEventHandler();

    initialize({
        appId: 'r4r-browser-cache',
        customTheme,
        historyProps: {
            basename: '/research/r4r',
        },
        eventHandler: eventHandler.onEvent,
        apiEndpoint,
    });

    const listener = () => {
        console.log('S Code detected')
        subscribeToAnalyticsEvents(window.s, eventHandler);
    }

    window.addEventListener('analytics_ready', listener)
    
    if(window.s){
        window.removeEventListener('analytics_ready', listener)
        subscribeToAnalyticsEvents(window.s, eventHandler);
    }
})

// This is to mimic s_code loading late
setTimeout(()=> {
    window.s = (e) => console.log('S CODE', e);
    window.dispatchEvent(new CustomEvent('analytics_ready'))
}, 2500)

