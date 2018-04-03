import {
    SET_CURRENT_SEARCH_TEXT,
    SET_CURRENT_SEARCH_QUERY_STRING,
    LOAD_NEW_SEARCH_RESULTS,
    CACHE_NEW_SEARCH_RESULTS,
    LOAD_NEW_FACET_RESULTS,
    FETCHING_STATUS,
    CACHE_RESOURCES,
    LOAD_RESOURCE,
    UPDATE_FILTER,
} from './actions'

const initialState = {
    isFetching: false,
    searchParams: '',
    referenceFacets: null,
    currentSearchQueryString: '',
    currentSearchText: '',
    currentResults: null, 
    currentFilters: null,
    currentMetaData: null,
    currentFacets: null, // Deprecate this after filterstate is implemented correctly
    currentResource: null,
    cachedSearches: {},
    cachedResources: {},
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_FILTER:
        const {
            filterType,
            filter
        } = action.payload
            return {
                ...state,
                currentFacets: {
                    ...state.currentFacets,
                    [filterType]: {
                        ...state.currentFacets[filterType],
                        items: {
                            ...state.currentFacets[filterType].items,
                            [filter]: {
                                ...state.currentFacets[filterType].items[filter],
                                selected: !state.currentFacets[filterType].items[filter].selected,
                            }
                        }
                    }
                }
            }
        case CACHE_RESOURCES:
            return {
                ...state,
                cachedResources: {
                    ...state.cachedResources,
                    ...action.payload,
                }
            }
        case LOAD_RESOURCE:
            return {
                ...state,
                currentResource: action.payload,
            }
        case FETCHING_STATUS:
            return {
                ...state,
                isFetching: action.payload,
            }
        case LOAD_NEW_FACET_RESULTS:
            return {
                ...state,
                referenceFacets: action.payload,
            }
        case LOAD_NEW_SEARCH_RESULTS:
            const {
                results: currentResults,
                facets: currentFacets,
                meta: currentMetaData,
            } = action.payload;
            return {
                ...state,
                currentResults,
                currentFacets,
                currentMetaData,
            };
        case CACHE_NEW_SEARCH_RESULTS:
            return {
                ...state,
                cachedSearches: {
                    ...state.cachedSearches,
                    ...action.payload,
                }
            }
        case SET_CURRENT_SEARCH_TEXT:
            return {
                ...state,
                currentSearchText: action.payload,
            }
        case SET_CURRENT_SEARCH_QUERY_STRING:
            return {
                ...state,
                currentSearchQueryString: action.payload,
            }
        default:
            return state;
    }
}

export default reducer;