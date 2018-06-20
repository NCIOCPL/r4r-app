[Demo](https://gifted-rosalind-be8dbe.netlify.com/) (Requires access to development server until release. Styles will be partially inherited from Cancer.gov)

# Resources for Researchers (A NCI Joint)

An embeddable React widget offering an elegant, extensible, synergistic way to communicate with the NCI-based Resource for Researchers API.

## Installation

R4R can be installed using npm directly from github. Specify the appropriate tag or branch for version control. On installation a script runs which is a modified version of the standard CRA build script. The differences are that the output files will not be hashed, they will be output in UMD format, and the entire dependency will be treated as a library pointing at /build/static/js/main.js. 

You can import the library using: 
```
import initializeR4R from 'r4r-app'
```

If you want to include the output stylesheet you need to specify the path, like so:
```
import 'r4r-app/build/static/css/main.css'
```


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

r4r is a self-contained app. If you want to be able to integrate it with local features of your site, you can use pass in a proxy function here. When an eventhandler function is available, r4r will broadcast events to it. For example, Cancer.gov uses a proxy that integrates with their local analytics library.

## Redux: State and Controllers (middleware)

Redux does double duty in r4r. Reducers are used to hold all state (with the exception of a small amount of state in the results view component for managing the mobilemenu) in the app, and dispatch middleware is used for the bulk of the app's controller needs (especially fetching data and communicating with the optional external eventHandler). This frees up the rest of the app to largely focus on being a render engine.

There are some real opportunities for improvement here, if so desired. At the time of writing, the data being returned from API calls is not normalized before being passed to a reducer (it is however converted from an array to a map in some cases, but this is actually an expensive operation (we don't have to worry too much though because the projected datasets will never be large enough for this to cause a drag)). This means more expensive render calculations at times (using the reselect library is another way to avoid unnecessary recalculations of data formatting in render cycles).

### Reducers

Most reducers are single concern (error for error messages, cache for cached fetch responses, announcements for aria messages, and searchForm for handling the input state of the searchbars across the app), with the exception of the heaviy overloaded api reducer. Future refinements would likely involve breaking this up into smaller scoped reducers.

### Middleware

The app uses a declarative middleware messaging system based around complex action objects with several methods used by the appropriate middleware. For example, a cache middleware uses an action's getCached and onCached methods and a fetch middleware uses an action's onSuccess method.

#### Metadata Middleware

This middleware simply adds useful metadata to any action object that is dispatched (it ignores thunks in the event that they are reimplemented in the future). As of initial release, this included a timestamp, the current browser location, and an array of previously visited urls within the site during the current session.

#### EventReporter Middleware

This middleware is returned from a createEventReporterMiddleware function that takes a single argument representing an event handling function.

If no event handler is passed, or the event handler is not a function, this middleware will do nothing but pass the current action down the chain.

If an event handler does exist and is a function, every action that is an object (i.e. no thunks) will be passed to the event handler before the next middleware is called with that action.

#### Cache Middleware

This middleware will pass on every action receives before executing any logic. 

This middleware only listens for action objects with the type "@@cache/RETRIEVE".

The cache middleware is dependent on an action object having a property called 'cache' with two methods, 'getCached' and 'onCached'. These methods allow the middleware to not be responsible for the particulars of how the cache should be interacted with If these don't exist in the correct form, the action will not be able to interact with the cache or execute a fetch request.

In the event that the current element being retrieved is already available in the cache, this middleware will return (it is up to the action's onCached method to handle the retrieval of the cached element and it's movement into active state).

If the element is not found in the cache, this middleware will dispatch the action again but with a new type that will trigger an interaction with the Fetch Middleware.

#### Fetch Middleware

The fetch middleware needs to be created by first calling createFetchMiddleware before adding it to the redux middleware chain. This initial call allows us to curry the middleware with the correct API URL to use for future fetch requests (this URL can be optionally specified in the initializeR4R settings object).

All actions will be immediately passed down the chain by this middleware, further action will only be executed if the action object's type matches '@@api/FETCH'.

Multiple fetch requests will not be executed, if the app is already fetching future requests will be ignored.

The fetch middleware requires an action to have a property 'fetch' with several properties of its own (required: url <String>, onSuccess <Function>; optional: timeout <Number>, options <Object>). 

The fetch middleware generates a unique key (currently using Date.now()) to allow stale requests to be ignored when they resolve. This determination is performed by a wrappedSuccess function that only executes the onSuccess method in the event that the request is still fresh.

A fetch is executed and parsed using various fetchHelper methods from the utility library, including a timedFetch method which polyfills the lack of ajax timeouts in the native fetch library.

### Reselect

Reselect is a small library that memoizes pieces of state. This allow us to avoid rerunning complex formatting utility functions on pieces of state being passed into a connected component through mapStateToProps except when the relevant (selected) state has changed.

## Utilities

Whenever possible, delegate imperative code to helper functions that are pure and testable. This includes pre and post processing of api calls, error handling, and reformatting data for render purposes. As much as possible, components should be responsible only for listening to changes in state and rendering based on the current state.

## Views

Views represent the top level containers that connect their various components to the redux store. These are equivalent to pages in a static app (the routing used is top level and will always change the url and entire viewport, unlike in some apps with subrouting). r4r has three main views: home, search results, and resource page; and one sub-view: error.

## Components 

### Live Region (ARIA)

This component sits at the top of the app and listens for messages passed to the announcements reducer. This should be used for broadcasting events to a screenreader that would go unnoticed otherwise. This is currently unused but should be taken advantage of in future development cycles.

### NavigationHandler

We want certain actions to happen when the url changes. This component watches the location object and handles those. This includes resetting the window scrollto, and clearing errors.

### FatalErrorBoundary

This is a true error boundary that will render <Error /> in the event that an error occurs in the render stage of the React app (effectively a fatal error)

### ErrorBoundary

This is not a true error boundary (it doesn't use the componentDidCatch lifecycle method). It listens for errors passed to the error reducer and will render <Error/> in the event one is detected. Used for timeouts, server errors, 404s, etc.

### SVG

The limited amount of graphics being used meant rather than importing images separately, they could be managed through a single component. Instead of using SVG files, the SVGs are treated as inline js. This is a minor optimization and should be abandoned in favor of direct importation for more graphical applications.

To add a new image, assign the inlined svg to a variable in the SVG component and then assign it to a key in the 'images' map. It should now be accessible to any component atempting to render <SVG /> by passing an iconType that corresponds to the image's key in the 'images' map.

<a name="component-theme"></a>
### Custom Themes

A custom Theme Provider sits on top of the App structure (much like a Redux provider) and passes down the custom theme hashmap through context to it's consumers. 

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

## Testing

This app is built on top of Create-React-App. As such, it uses jest as it's testrunner and assertion library. In addition, enzyme is used for snapshot testing and component mounting (shallow or full).

Jest is configured in two ways: directly in package.json using the limited methods that CRA supports, and in setupTests.js (where mocks are set, adapters configures, and globals created). The library 'enzyme-to-json' is used for serializing the enzyme output into a readable format for snapshot tests. 

Current test coverage metrics are available by running 'npm run coverage' in the command line.

When writing tests, it may be necessary to mount the component instead of simply shallow rendering. In that event, issues may arise because of context-based components in the render tree. Helper methods have been created that allow you to mount with the theme context provider and/or a static router to obviate these issues. They wrappers will be visible in snapshots but use only default arguments and should not change when tests are rerun.

## NOTES:

1) Requests are primarily sanitized using the querystring library which uses strint-uri-encode by default (https://github.com/kevva/strict-uri-encode)
2) Complex propTypes interfaces intended for reuse should be defined in interfaces/index.js and exported.
3) Further customizations to the 'install' script can be done in config-overrides.js which is used by react-app-rewired to customize CRA. Some changes aren't possible without the additional step of forking react-scripts, but that was not necessary in this case.