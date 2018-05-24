// I've refactored The load resource thunk into a messaging based middleware chain
// Remember, in a piece of redux middleware, calling next will pass the action down
// the chain (which eventually ends in dispatching to the reducer), calling dispatch will 
// pass the action into the beginning of the chain.
const cacheMiddleware =  ({ dispatch, getState }) => next => action => {
    next(action);

    if(action.type !== '@@cache/RETRIEVE'){
        return;
    }

    const cachedElement = action.cache.getCached(getState);
    if(cachedElement) {
        console.log('Resource already cached, loading from local cache');
        action.cache.onCached(dispatch, getState)(cachedElement);
        return;
    }

    dispatch({
        ...action,
        type: '@@api/FETCH',
    });
}

export default cacheMiddleware;