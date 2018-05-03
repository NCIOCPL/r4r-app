import {
    CACHE_NEW_SEARCH_RESULTS,
    CACHE_RESOURCES,
} from '../api/actions';


const initialState = {
    cachedSearches: {},
    cachedResources: {},    
}

// TODO: This is going to be where the cache lives in the future. For now it is redundant and unused.

const reducer = (state = initialState, action) => {
    switch(action.type){
        case CACHE_RESOURCES:
            return {
                ...state,
                cachedResources: {
                    ...state.cachedResources,
                    ...action.payload,
                }
            }
        case CACHE_NEW_SEARCH_RESULTS:
            return {
                ...state,
                cachedSearches: {
                    ...state.cachedSearches,
                    ...action.payload,
                }
            }
        default:
            return state;
    }
}

export default reducer;