import {
    CACHE_NEW_SEARCH_RESULTS,
    CACHE_RESOURCES,
} from '../api/actions';


const initialState = {
    cachedSearches: {},
    cachedResources: {},    
}

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