// This is an example. This middleware has access to the store and could be curried with history, meaning it can
// inject location, time etc meta settings and then pass a new action that would only be picked up by the eventHandler
// middleware, which would no longer have to listen to all events, just events broadcast by this middleware.

const timestampMiddleware = store => next => action => {
    action.meta = {
        ...action.meta,
        timestamp: Date.now(),
    }
    next(action);
}

export default timestampMiddleware;