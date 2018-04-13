import {
    SET_CURRENT_SEARCH_TEXT,
    SET_CURRENT_SEARCH_QUERY_STRING,
    LOAD_NEW_SEARCH_RESULTS,
    CACHE_NEW_SEARCH_RESULTS,
    LOAD_NEW_FACET_RESULTS,
    FETCHING_FACETS_STATUS,
    FETCHING_STATUS,
    CACHE_RESOURCES,
    LOAD_RESOURCE,
    UPDATE_FILTER,
    CLEAR_FILTERS,
} from './actions'

const initialState = {
    isFetching: false,
    isFetchingFacets: false,
    searchParams: '',
    referenceFacets: null,
    currentSearchQueryString: '',
    currentSearchText: '',
    currentResults: null, 
    currentFilters: null,
    currentMetaData: null,
    currentFacets: null,
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
            } = action.payload;
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
        case CLEAR_FILTERS:
            const newCurrentFacets = Object.entries(state.currentFacets).reduce((acc, [facetKey, facetValue]) => {
                const newItems = Object.entries(facetValue.items).reduce((acc, [itemKey, itemValue])=> {
                    acc[itemKey] = {
                        ...itemValue,
                        selected: false,
                    }
                    return acc;
                }, {})
                acc[facetKey] = {
                    ...facetValue,
                    items: newItems,
                } 
                return acc;
            }, {})
            return {
                ...state,
                currentFacets: {
                    ...state.currentFacets,
                    ...newCurrentFacets,
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
        case FETCHING_FACETS_STATUS:
            return {
                ...state,
                isFetchingFacets: action.payload,
            }
        case LOAD_NEW_FACET_RESULTS:
            return {
                ...state,
                referenceFacets: action.payload,
                isFetchingFacets: false,
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