const createEventReporterMiddleware = eventHandler => store => next => action => {
    // a) If an event handler wasn't passed the middleware will simply pass the action forward
    // b) Don't report thunks
    if(typeof eventHandler === 'function' && typeof action !== 'function'){
        eventHandler(action);
    }
    next(action);
}

export default createEventReporterMiddleware;