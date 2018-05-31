// This is an example. This middleware has access to the store and could be curried with history, meaning it can
// inject location, time etc meta settings and then pass a new action that would only be picked up by the eventHandler
// middleware, which would no longer have to listen to all events, just events broadcast by this middleware.

const metadataMiddleware = store => next => action => {
    // Ignore thunks
    if(typeof action === 'object'){
        action.meta = {
            ...action.meta,
            timestamp: Date.now(),
            location: window.location,
            history: store.getState().history.map(({pathname, search}) => `${pathname}${search}`)
        }
    }
    next(action);
}

export default metadataMiddleware;