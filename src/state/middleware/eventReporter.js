const createEventReporterMiddleware = eventHandler => store => next => action => {
    // If an event handler wasn't passed the middleware will simply pass the action forward
    if(typeof eventHandler === 'function'){
        eventHandler(action);
    }
    const { meta, ...actionWithoutMeta } = action;
    next(actionWithoutMeta);
}

export default createEventReporterMiddleware;