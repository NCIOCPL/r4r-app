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
import { loadStateFromSessionStorage, saveStatetoSessionStorage } from './cache';

// Don't need to fingerprint since it's session storage.
const cachedState = loadStateFromSessionStorage();

const store = createStore(
    combineReducers(reducers),
    //TODO: Activate session storage 
    // cachedState,
    composeWithDevTools(applyMiddleware(
        thunk
    ))
);

const saveAllStateToSessionStorage = () => {
    const state = store.getState();
    console.log('Saving state to session storage')
    saveStatetoSessionStorage(state);
}
// store.subscribe(saveAllStateToSessionStorage);

const ReduxConnectedApp = () => (
    <ErrorBoundary>
        <Provider store={ store }>
            <div className="r4r-container">
                <Router />
            </div>
        </Provider>
    </ErrorBoundary>
);

ReactDOM.render(<ReduxConnectedApp />, document.getElementById('root'));
