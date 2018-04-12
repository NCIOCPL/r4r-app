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
import { createTheme, ThemeProvider, Theme } from './theme';

// Remove this block after CGOV custom theme development is complete
if(process.env.NODE_ENV !== 'production') {
    import('./cancergov_styles/nvcg.css');
    import('./cancergov_styles/InnerPage.css');
    import('./cancergov_styles/r4r__cgov-theme.css');
}

/**
 * @param {object} [config]
 * @param {object} [config.theme] a hashmap where key = r4r default classname and custom classname to inject alongside it (or else default)
 */
const initialize = ({
    customTheme = {},
    appId = 'DEFAULT_APP_ID',
} = {}) => {
    if(typeof customTheme !== 'object' || customTheme === null) {
        throw new Error('customTheme must be a non-null object')
    }
    
    const theme = createTheme(customTheme);
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
                    <Theme element='main' className="r4r-container">
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

// CancerGov config object
const customTheme = {
    'r4r-container': 'cancer-gov'
};

document.addEventListener('DOMContentLoaded', () => {
    initialize({
        appId: 'r4r-browser-cache',
        customTheme,
    });
})

