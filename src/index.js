import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as myReducers from "./state";
import { createBrowserHistory } from "history";
import {
  routerMiddleware as createRouterMiddleware,
  routerReducer,
} from "react-router-redux";
import createEventReporterMiddleware from "./state/middleware/eventReporter";
import createFetchMiddleware from "./state/middleware/fetchMiddleware";
import metadataMiddleware from "./state/middleware/metadata";
import cacheMiddleware from "./state/middleware/cacheMiddleware";
import { Helmet } from "react-helmet";
import Router from "./Router";
import { FatalErrorBoundary } from "./components";
import NavigationHandler from "./NavigationHandler";
import LiveRegion from "./LiveRegion";
import {
  loadStateFromSessionStorage,
  saveStatetoSessionStorage,
} from "./cache";
import { createTheme, ThemeProvider, Theme } from "./theme";
import { getProductTestBase } from "./utilities/getProductTestBase";
import cgdpGenericAppModuleInit from "./cgdp-legacy/cgdp-generic-app-module-init";

// This block is for CGOV custom theming development only. Comment out for widgetizing.
// if(process.env.NODE_ENV !== 'production') {
//     import('./cancergov_styles/nvcg.css');
//     import('./cancergov_styles/InnerPage.css');
// }

/**
 * @param {object} [config]
 * @param {string} [config.appId = 'DEFAULT_APP_ID'] the id used by the app for sessionStorage
 * @param {string} [config.rootId = 'r4r-root] the id of the dom node for the app to attach to
 * @param {object} [config.theme = {}] a hashmap where key = r4r default classname and custom classname to inject alongside it (or else default)
 * @param {object} [config.historyProps = {}] valid options for the History library initialization
 * @param {function} [eventHandler] If you want R4R to broadcast events, give it something to broadcast to
 * @param {string} [apiEndpoint = 'https://webapis.cancer.gov/r4r/v1'] The location of the API you want R4R to talk to
 * @returns {Node} The DOM node to which the app is hooked
 */
const initializeR4R = ({
  baseHost = "http://localhost:3000",
  basePath = "/",
  customTheme = {},
  appId = "@@/DEFAULT_APP_ID",
  useSessionStorage = true,
  rootId = "NCI-app-root",
  historyProps = {},
  eventHandler,
  apiEndpoint = "https://webapis.cancer.gov/r4r/v1",
} = {}) => {
  // 1) Set up theme
  if (typeof customTheme !== "object" || customTheme === null) {
    throw new Error("customTheme must be an object");
  }
  const theme = createTheme(customTheme);

  // 2) Set up Redux (session storage caching in production only)
  let cachedState;
  if (process.env.NODE_ENV !== "development" && useSessionStorage === true) {
    cachedState = loadStateFromSessionStorage(appId);
  }

  const history = createBrowserHistory(historyProps);

  const eventReporterMiddleware = createEventReporterMiddleware(eventHandler);
  const fetchMiddleware = createFetchMiddleware(apiEndpoint);
  const routerMiddleware = createRouterMiddleware(history);

  const reducers = {
    ...myReducers,
    router: routerReducer,
  };

  const store = createStore(
    combineReducers(reducers),
    cachedState,
    composeWithDevTools(
      applyMiddleware(
        metadataMiddleware,
        routerMiddleware,
        cacheMiddleware,
        fetchMiddleware,
        eventReporterMiddleware,
      ),
    ),
  );

  if (process.env.NODE_ENV !== "development" && useSessionStorage === true) {
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

  // This event is not urrently being used by analytics but will be retained in the event that it becomes useful.
  store.dispatch({
    type: "@@event/APP_INITIALIZATION",
    meta: {
      location: window.location,
    },
  });

  // Set up the baseUrl to use for react-helmet
  const baseUrl = `${window.location.origin}${historyProps.basename || ""}`;
  store.dispatch({
    type: "LOAD SETTINGS",
    payload: {
      baseUrl,
    },
  });

  // 3) Set up component tree
  const App = () => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Theme element='main' className='r4r-container'>
          <FatalErrorBoundary dispatch={store.dispatch}>
            <Helmet defaultTitle='Resources for Researchers - National Cancer Institute'>
              <meta
                name='description'
                content='Resources for Researchers is a tool to give researchers a better understanding of the various tools available to them.'
              />
              <meta
                property='og:description'
                content='Resources for Researchers is a tool to give researchers a better understanding of the various tools available to them.'
              />
              <meta
                property='og:title'
                content='Resources for Researchers - National Cancer Institute'
              />
              <meta property='og:url' content={baseUrl} />
            </Helmet>
            <LiveRegion />
            <NavigationHandler>
              <Router basename={`${baseHost}${basePath}`} history={history} />
            </NavigationHandler>
          </FatalErrorBoundary>
        </Theme>
      </ThemeProvider>
    </Provider>
  );

  const appRootDOMNode = document.getElementById(rootId);
  ReactDOM.render(<App />, appRootDOMNode);
  return appRootDOMNode;
};

export default initializeR4R;

window.R4RApp = cgdpGenericAppModuleInit(initializeR4R);

/*************************************
 *  DEVELOPMENT CONFIG
 ************************************/

// The following lets us run the app in dev not in situ as would normally be the case.
const appParams = window.APP_PARAMS || {};
if (process.env.NODE_ENV !== "production") {
  //This is DEV
  const dictSettings = {
    ...appParams,
  };
  initializeR4R(dictSettings);
} else if (window?.location?.host === "react-app-dev.cancer.gov") {
  // This is for product testing
  console.log("basepath set to: " + getProductTestBase());
  const dictSettings = {
    ...appParams,
    ...{
      basePath: getProductTestBase(),
      historyProps: {
        basename: getProductTestBase(),
      },
    },
  };
  initializeR4R(dictSettings);
}
