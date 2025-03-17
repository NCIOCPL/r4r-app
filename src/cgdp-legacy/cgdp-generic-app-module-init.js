/***
 * @file
 * Sets app config for initialization.
 */
import createEventHandler from "./eventHandler";
import { cancerGovAnalyticsHandler } from "./analyticsHandler";
import { exitDisclaimerEventHandler } from "./exitDisclaimerHandler";
import {
  dispatchTrackingEvent,
  EVENT_TYPES
} from "./dumb-datalayer";

// React Helmet is removing all elements with data-react-helmet="true" on the page except the ones it directly controls. This is a big
// issue. This code adds it only to the elements we want to control manually to avoid that issue.
//
// NOTE: Since we had issues with Google indexing the applications, we normally just strip the HTML elements in the
// Drupal portion so that Google does not get mixed signals. Since this is the current logic and
// we are not doing a lot of rewriting to make this a generic app module, we will leave as is.
const elementSelectors = [
  ["name", "description"],
  ["property", "og:title"],
  ["property", "og:description"],
  ["property", "og:url"]
];
const elementsUsedByR4R = elementSelectors.map(el => {
  return document.querySelector(`meta[${el[0]}="${el[1]}"]`);
});
elementsUsedByR4R.forEach(el => {
  // Some elements are originated by react-helmet after this script runs and will be null
  if (el) {
    el.setAttribute("data-react-helmet", "true");
  }
});

/**
 * This is a function that will return a function suitable for using
 * as a CGDP Generic App Module initializer.
 * @param {Function} initializeR4R - The function that will initialize the R4R app.
 * @returns A function that can be set on the window object and used as a CGDP Generic App Module initializer.
 */
const cgdpGenericAppModuleInit = (initializeR4R) => ({
  apiEndpoint = 'https://webapis.cancer.gov/r4r/v1',
  baseHost = "http://localhost:3000",
  basePath = "/",
  canonicalHost = "https://www.cancer.gov",
  customTheme = {
    'r4r-container': 'row',
    'searchbar__container': 'cancer-gov',
    'searchbar__button--submit': 'button',
    'browse__tile': 'arrow-link',
    'similar-resource__tile': 'arrow-link',
  },
  rootId = "NCI-app-root",
}) => {
  // set up event handling and analytics
  const eventHandler = createEventHandler();
  eventHandler.subscribe(exitDisclaimerEventHandler);
  eventHandler.subscribe(cancerGovAnalyticsHandler);

  const config = {
  apiEndpoint,
  baseHost,
  basePath,
  customTheme,
  eventHandler: eventHandler.onEvent,
  historyProps: {
    basename: basePath,
  },
  rootId
  };

  // Fire off page load do this before React mucks with our page.
  // The common content load items will be applied here,
  // pulled from metadata. So data can be an empty object.
  dispatchTrackingEvent(EVENT_TYPES.Load, {});
  initializeR4R(config);
}

export default cgdpGenericAppModuleInit;
