import {
    loadResource,
    cacheResources,
} from '../api/actions';


const getCachedState = (state, { cacheType, cacheKey }) => {
    console.log(cacheType)
    switch(cacheType) {
        case 'RESOURCE':
            return state.cache.cachedResources[cacheKey];            
        // Currently not handling resources searches (process isn't generic yet)
        // case 'RESOURCES':
        //     return state.cache.cachedSearches[cacheKey];
        case 'FACETS':
            return state.api.currentFacets;
        default:
            return undefined;
    }
}

// I've refactored The load resource thunk into a messaging based middleware chain
// Remember, in a piece of redux middleware, calling next will pass the action down
// the chain (which eventually ends in dispatching to the reducer), calling dispatch will 
// pass the action into the beginning of the chain.
const cacheMiddleware =  ({ dispatch, getState }) => next => action => {
    next(action);

    if(action.type !== '@@cache/RETRIEVE'){
        return
    }
    
    const cachedElement = getCachedState(getState(), action.meta.cache)

    if(cachedElement) {
        console.log('Resource already cached, loading from local cache')
        action.meta.cache.onCached(dispatch)(cachedElement)
        return;
    }

    dispatch({
        ...action,
        type: '@@api/FETCH',
    })
}

export default cacheMiddleware;