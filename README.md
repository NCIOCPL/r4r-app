[Demo](https://gifted-rosalind-be8dbe.netlify.com/) (Requires access to development server until release. Styles will be partially inherited from Cancer.gov)

# Resources for Researchers (A NCI Joint)

An embeddable React widget offering an elegant, extensible, synergistic way to communicate with the NCI-based Resource for Researchers API.

## Initialization 

### initializeR4R()

The React component tree and call to ReactDOM.render is wrapped in a custom initialization function that provides the ability to customize parts of the experience. This initialize function needs to be called manually, with or without a custom settings object.

### initializeR4R() with custom settings

#### settings.customTheme (default = {})

r4r contains a custom theme provider that allows mapping a site's local classnames to r4r objects. This optional object is a map of r4r classnames as keys, and the local classname to attach to the element as the value. Elements that aren't given an override value have the classname 'r4r-DEFAULT' instead.

See the [component explanation below](#component-theme) for more details.

#### settings.useSessionStorage (default = true)

Session storage is an optional feature in production. Disable it by setting this to false.

#### settings.appId (default = '@@r4r/DEFAULT_APP_ID')

The id used for serializing and deserializing data from the browser's session storage.

#### settings.rootId (default = 'r4r-root')

The id of the element to which ReactDOM.render will attach the r4r app.

#### settings.historyProps (default = {})

The history library takes optional settings on initialization. For example, on Cancer.gov, a basename is expected to always be prepended to the app's location. For more information about the history API, click [here](https://github.com/ReactTraining/history).

#### settings.apiEndpoint (default = 'https://r4rapi.cancer.gov/v1')

This one is pretty important. Make sure you have the correct url for the api provided here. r4r will worry about the resource/resources endpoint distinction.

#### settings.eventHandler (default = undefined)

r4r is a self-contained app. If you want to be able to integrate it with local features of your site, you can use pass in a proxy function here. When an eventhandler function is available, r4r will broadcast events to it. For example, Cancer.gov uses a proxy that integrates with the local analytics library.

## Redux: State and Controllers (middleware)

Redux does double duty in r4r. Reducers are used to hold all state (with the exception of a small amount of state in the results view component) in the app, and dispatch middleware is used for the bulk of the app's controller needs (especially fetching data and communicating with the optional external eventHandler). This frees up the rest of the app to largely focus on being a render engine.

There are some real opportunities for improvement here, if so desired. At the time of writing, the data being returned from API calls is not normalized before being passed to a reducer (it is however converted from an array to a map in some cases, but this is actually an expensive operation (we don't have to worry too much though because the projected datasets will never be large enough for this to cause a drag)). That means the app rendering is based on the structure of the returned data more than it should be. This means more expensive render calculations at times (using the reselect library is another way to avoid unnecessary recalculations of data formatting in render cycles).

### Reducers

Most reducers are single concern (error for error messages, cache for cached fetch responses, announcements for aria messages, and searchForm for handling the input state of the searchbars across the app), with the exception of the heaviy overloaded api reducer. Future refinements would likely involve breaking this up into smaller scoped reducers.

### Middleware 

Currently the app uses several thunks to handle almost all controller logic. This was done for simplicity but offers a lot of real opportunities for improvement using middleware messaging, either custom or with redux-sagas.

...list middlewares here later...

## Utilities

Whenever possible, delegate imperative code to helper functions that are pure and testable. This includes pre and post processing of api calls, error handling, and reformatting data for render purposes. As much as possible, components should be responsible only for listening to changes in state and rendering based on the current state.

## Views

Views represent the top level containers that connect their various components to the redux store. These are equivalent to pages in a static app (the routing used is top level and will always change the url and entire viewport, unlike in some apps with subrouting). r4r has three views: home, search results, and resource page.

## Components 

### Live Region (ARIA)

This component sits at the top of the app and listens for messages passed to the announcements reducer. This should be used for broadcasting events to a screenreader that would go unnoticed otherwise.

### NavigationHandler

We want certain actions to happen when the url changes/the user navigates. This component watches the location object and handles those. This includes reseting the window scrollto, and clearing errors. (Canceling fetch requests should be handled here too)

### FatalErrorBoundary

This is a true error boundary that will render in the event that an error occurs in the render stage of the React app (effectively a fatal error)

### ErrorBoundary

This is not a true error boundary (it doesn't use the componentDidCatch lifecycle method). It listens for errors passed to the error reducer and will render in the event one is detected. Used for timeouts, server errors, etc.

<a name="component-theme"></a>
### Custom Themes

A custom Theme Provider sits on top of the App structure (much like a Redux provider) and passes down the context chain the custom theme hashmap. 

To use a theme classname instead of a standard one, use a Theme component. Pass it all the same props you normally would, as well as a type prop specifying what type of output element you want the themed element to be.
Make sure you have a className for the Theme component, as this is what it uses to look up the custom classnames from the hashmap.

```
<div onClick={() => {}} className="banana" />
```

becomes:

```
<Theme element="div" className="banana" onClick={() => {}} />
```

Note: Theme component with classnames that are not a part of the hash will not fail, but have no function except to add complexity to the component tree.