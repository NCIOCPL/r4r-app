import {
    SET_CURRENT_SEARCH_TEXT,
    LOAD_NEW_SEARCH_RESULTS,
    UPDATE_TOOLTYPE_FILTER,
    LOAD_NEW_FACET_RESULTS,
    FETCHING_FACETS_STATUS,
    FETCHING_STATUS,
    LOAD_RESOURCE,
    UPDATE_FILTER,
    CLEAR_FILTERS,
} from './actions';
import {
    REGISTER_ERROR,
} from '../error/actions';

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
                },
                // We want to reset the results page to the first page of results whenever a filter is flipped
                currentMetaData: {
                    ...state.currentMetaData,
                    from: 0,
                }
            }
        case UPDATE_TOOLTYPE_FILTER:
            const {
                toolSubtypes,
                ...currFacets
            } = state.currentFacets;
            return {
                ...state,
                currentFacets: {
                    ...currFacets,
                    'toolTypes': {
                        ...state.currentFacets['toolTypes'],
                        items: {
                            ...state.currentFacets['toolTypes'].items,
                            [action.payload.filter]: {
                                ...state.currentFacets['toolTypes'].items[action.payload.filter],
                                selected: !state.currentFacets['toolTypes'].items[action.payload.filter].selected,
                            }
                        }
                    },
                },
                // We want to reset the results page to the first page of results whenever a filter is flipped                
                currentMetaData: {
                    ...state.currentMetaData,
                    from: 0,
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
                },
                currentMetaData: {
                    ...state.currentMetaData,
                    from: 0,
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
            } = action.payload.results;
            return {
                ...state,
                currentSearchQueryString: action.payload.newQueryString,
                isFetching: false,
                currentResults,
                currentFacets,
                currentMetaData,
            };
        case SET_CURRENT_SEARCH_TEXT:
            return {
                ...state,
                currentSearchText: action.payload,
            }
        case REGISTER_ERROR: 
            return {
                ...state,
                isFetching: false,
                isFetchingFacets: false
            }
        default:
            return state;
    }
}

export default reducer;