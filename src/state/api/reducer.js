import {
    SET_CURRENT_SEARCH_TEXT,
    LOAD_NEW_SEARCH_RESULTS,
    LOAD_NEW_FACET_RESULTS,
    UNMOUNT_RESULTS_VIEW,
    FETCHING_STATUS,
    LOAD_RESOURCE,
} from './actions';
import {
    REGISTER_ERROR,
} from '../error/actions';

const initialState = {
    isFetching: false,
    fetchId: null,
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
        case LOAD_RESOURCE:
            return {
                ...state,
                currentResource: action.payload,
                isFetching: false,
                fetchId: null,
            }
        case FETCHING_STATUS:
            return {
                ...state,
                isFetching: action.payload.isFetching,
                fetchId: action.payload.fetchId,
            }
        case LOAD_NEW_FACET_RESULTS:
            return {
                ...state,
                referenceFacets: action.payload,
                isFetching: false,
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
                fetchId: null,
                currentResults,
                currentFacets,
                currentMetaData,
            };
        case UNMOUNT_RESULTS_VIEW:
            return {
                ...state,
                currentSearchQueryString: '',
                isFetching: false,
                fetchId: null,
                currentResults: null,
                currentFacets: null,
                currentMetaData: null,
            }
        case SET_CURRENT_SEARCH_TEXT:
            return {
                ...state,
                currentSearchText: action.payload,
            }
        case REGISTER_ERROR: 
            return {
                ...state,
                isFetching: false,
                fetchId: null,
                isFetchingFacets: false
            }
        default:
            return state;
    }
}

export default reducer;