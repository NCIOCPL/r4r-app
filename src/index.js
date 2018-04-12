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
import LiveRegion from './LiveRegion';
import { Helmet } from 'react-helmet';
import { loadStateFromSessionStorage, saveStatetoSessionStorage } from './cache';
import { ThemeProvider, Theme } from './themes';

/**
 * @param {object} [config]
 * @param {object} [config.theme] a hashmap where key = r4r default classname and custom classname to inject alongside it (or else default)
 */
const initialize = ({
    customTheme = {},
} = {}) => {

    // ################ TODO: MODULARIZE
    // For custom theming, we could use our own context API, but since we already have react-redux's connect HOC,
    // it makes sense to standardize the context usage and just provide access through the store (despite no
    // futher changes after instantiation.). We will have to seed our reducer in a slightly more dynamic way.
    const defaultThemeHooks = [
        'r4r-container'
    ]

    const theme = defaultThemeHooks.reduce((acc, hook) => {
        acc[hook] = customTheme[hook] || 'r4r__DEFAULT'
        return acc;
    }, {})

    const appId = 'r4r-browser-cache'
    let cachedState;

    if(process.env.NODE_ENV !== 'development') {
        cachedState = loadStateFromSessionStorage(appId);
    }

    const store = createStore(
        combineReducers(reducers),
        cachedState,
        composeWithDevTools(applyMiddleware(
            thunk
        ))
    );

    if(process.env.NODE_ENV !== 'development') {
        const saveAllStateToSessionStorage = () => {
            const state = store.getState();
            saveStatetoSessionStorage({
                state,
                appId,
            });
        };
    
        store.subscribe(saveAllStateToSessionStorage);
    }

    const ReduxConnectedApp = () => (
        <ErrorBoundary>
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <Theme type='main' className="r4r-container">
                        <Helmet 
                            defaultTitle="Resources for Researchers - National Cancer Institute"
                        >
                            <meta name="description" content="Resources for Researchers is a tool to give researchers a better understanding of the various tools available to them." />
                            <meta property="twitter:title" content="Resources for Researchers - National Cancer Institute" />
                        </Helmet>
                        <LiveRegion />
                        <Router />
                    </Theme>
                </ThemeProvider>
            </Provider>
        </ErrorBoundary>
    );

    ReactDOM.render(<ReduxConnectedApp />, document.getElementById('r4r-root'));
}

document.addEventListener('DOMContentLoaded', () => {
    initialize();
})

