const timestampMiddleware = store => next => action => {
    action.meta = {
        ...action.meta,
        timestamp: Date.now(),
    }
    next(action);
}

export default timestampMiddleware;