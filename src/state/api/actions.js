import { updateSearchBar } from '../searchForm/actions';
import {
    formatRawResourcesFacets,
    composeQueryString,
} from '../../utilities';
import {
    timedFetch,
    handleResponse,
    handleNetworkFailure,
    constructErrorMessage,
} from '../../utilities/fetchHelpers'
import {
    validateSearchResponse,
    validateSearchRequest,
} from '../../utilities/validation';

export const CLEAR_FILTERS = "CLEAR FILTERS";
export const UPDATE_FILTER = "UPDATE FILTER";
export const LOAD_RESOURCE = "LOAD RESOURCE";
export const CACHE_RESOURCES = "CACHE RESOURCES";
export const FETCHING_STATUS = "FETCHING STATUS";
export const UPDATE_TOOLTYPE_FILTER = "UPDATE TOOLTYPE FILTER";
export const LOAD_NEW_FACET_RESULTS = "LOAD NEW FACET RESULTS";
export const LOAD_NEW_SEARCH_RESULTS = "LOAD NEW SEARCH RESULTS";
export const FETCHING_FACETS_STATUS = "FETCHING FACETS STATUS";
export const SET_CURRENT_SEARCH_TEXT = "SET CURRENT SEARCH TEXT";
export const CACHE_NEW_SEARCH_RESULTS = "CACHE NEW SEARCH RESULTS";
export const SET_CURRENT_SEARCH_QUERY_STRING = "SET CURRENT SEARCH QUERY STRING";

const setFetchingStatus = status => ({
    type: FETCHING_STATUS,
    payload: status,
})

const setFacetsFetchingStatus = status => ({
    type: FETCHING_FACETS_STATUS,
    payload: status,
})

const cacheResources = resources => {
    const processedResources = resources.reduce((acc, resource) => {
        acc[resource.id] = resource;
        return acc
    }, {});
    
    return {
        type: CACHE_RESOURCES,
        payload: processedResources,
    }
}

const loadResource = resource => ({
    type: LOAD_RESOURCE,
    payload: resource,
})

const loadNewSearchResults = results => ({
    type: LOAD_NEW_SEARCH_RESULTS,
    payload: results,
})

const cacheNewSearchResults = results => ({
    type: CACHE_NEW_SEARCH_RESULTS,
    payload: results,
})

const loadNewFacetResults = results => ({
    type: LOAD_NEW_FACET_RESULTS,
    payload: results,
})

const setCurrentSearchText = searchText => ({
    type: SET_CURRENT_SEARCH_TEXT,
    payload: searchText,
})

const setCurrentSearchQueryString = queryString => ({
    type: SET_CURRENT_SEARCH_QUERY_STRING,
    payload: queryString,
})

// Tooltypes are a special case because when we clear a selected tooltype
// we want to also clear all currently checked toolsubtypes. We can clear all toolsubtypes
// regardless of what state the tooltype is switching to because if it's being unchecked
// all toolsubtypes need to be cleared, and if it's being checked then we can assume that
// no toolsubtypes had been selected.
export const updateFilter = (filterType, filter) => {
    if(filterType === 'toolTypes'){
        return {
            type: UPDATE_TOOLTYPE_FILTER,
            payload: {
                filter,
            },
        }
    }

    return {
        type: UPDATE_FILTER,
        payload: {
            filterType,
            filter,
        },
    }
}

export const clearFilters = () => ({
    type: CLEAR_FILTERS,
})

const API_resourcesEndpoint = 'https://r4rapi-blue-dev.cancer.gov/v1/resources';
const API_resourceEndpoint = 'https://r4rapi-blue-dev.cancer.gov/v1/resource/';

// When the home page loads, we want to fetch all available facets to use for dynamically
// rendering the browse tiles.
// TODO: If we pass in the referenceFacets we can make this purer. (Or if we handle validation in the 
// component. Or if we chain two thunks, one for cache validation and one for search execution.)
export const loadFacets = () => (dispatch, getState) => {
    const queryString = '?size=0&includeFacets=toolTypes&includeFacets=researchAreas';
    const queryEndpoint = API_resourcesEndpoint + queryString;
    //TODO: This process can be abstracted into a generic load from cache method to be shared (later)
    
    // We want this to be a cheap lookup to see if a facets object exists, the only way to load one
    // will be after a successfull fetch so we shouldn't need to do any additional validation.
    const store = getState();
    const isCached = store.api.referenceFacets;
    if(isCached){
        console.log('Facets are cached already.')
        return;
    }
    
    console.log('Fetching facets')
    dispatch(setFacetsFetchingStatus(true));
    timedFetch(queryEndpoint, 15000)
        .catch(handleNetworkFailure)
        .then(handleResponse)
        .then(res => {
            const formattedFacets = formatRawResourcesFacets(res.facets)
            dispatch(loadNewFacetResults(formattedFacets));
        })
        .catch(err => constructErrorMessage(err, dispatch))
}

export const newSearch = searchParams => (dispatch, getState, history) => {
    const store = getState();

    // Do not allow multiple fetchs to be executed in parallel.
    if(store.api.isFetching){
        console.log('Already fetching. Aborting.')
        return;
    }

    const currentSearchQueryString = store.api.currentSearchQueryString;
    const searchCache = store.api.cachedSearches;
    const searchText = searchParams.q || '';
    const newQueryString = composeQueryString(searchParams);
    const isCached = searchCache.hasOwnProperty(newQueryString);
    const isAlreadyOnSearchPage = history.location.pathname.toLowerCase() === '/search';
    const isAlreadyAtCorrectURL = history.location.search === newQueryString;

    // We only want to retain search text on the results page (otherwise stale text will be visible on page changes)
    dispatch(updateSearchBar({
        page: 'results',
        value: searchText,
    }));
    dispatch(updateSearchBar({
        page: 'resource',
        value: '',
    }));
    dispatch(updateSearchBar({
        page: 'home',
        value: '',
    }));

    if(newQueryString === currentSearchQueryString) {
        console.log('Current search matches last search, reusing results')
        if(isAlreadyOnSearchPage) {
            return;
        }
    }
    if(isCached) {
        console.log('Current search is already cached, loading from cache')
        const cachedResults = searchCache[newQueryString];
        dispatch(loadNewSearchResults(cachedResults));
        dispatch(setCurrentSearchQueryString(newQueryString))
        if(isAlreadyAtCorrectURL){
            return;
        }
        return
    }

    //TODO: This won't work on new filters where the search isn't cached but we don't want to redirect
    console.log('Current search is not cached, fetching from db')
    dispatch(setFetchingStatus(true));

    console.log('Fetching from API')    
    timedFetch(API_resourcesEndpoint + newQueryString, 15000)
        .catch(handleNetworkFailure)
        .then(handleResponse)
        .then(validateSearchResponse)
        .then(res => {
            // Resources will be stored in a separate cache
            dispatch(cacheResources(res.results));

            // Search results will be processed to
            // a) convert facets into a map for easy lookups
            // b) replace full resources with just id of resources
            // When a searchresult is loaded, the resources will be repopulated from the resource cache.
            // This avoids a lot of duplication in the results cache.
            const formattedFacets = formatRawResourcesFacets(res.facets)
            const processedResults = {
                ...res,
                facets: formattedFacets,
            };
            const resultsToCache = {
                [newQueryString]: processedResults,
            }    
            dispatch(cacheNewSearchResults(resultsToCache));
            dispatch(setCurrentSearchQueryString(newQueryString))
            dispatch(loadNewSearchResults(processedResults));
            if(!isAlreadyAtCorrectURL) {
                console.log('navigating to search page')
                history.push(`/search${ newQueryString }`)
            }            
        })
        .catch(err => constructErrorMessage(err, dispatch))

}

export const fetchResource = resourceId => (dispatch, getState) => {
    const store = getState();
    const cache = store.api.cachedResources;
    const cachedResource = cache[resourceId];
    if(cachedResource) {
        // Set cachedResource to currentResource (we don't need to bother to check if the current
        // resource is the same because it's so cheap in this case to copy over the object from
        // the cache again, even if it isn't the most efficient.
        console.log('Resource already cached, loading from local cache')
        dispatch(loadResource(cachedResource));
        return;
    }

    console.log('Resource not cached, fetching from db')
    timedFetch(API_resourceEndpoint + resourceId, 15000)
        .catch(handleNetworkFailure)
        .then(handleResponse)
        .then(res => {
            dispatch(cacheResources([res]));
            dispatch(loadResource(res));
        })
        .catch(err => constructErrorMessage(err, dispatch))
}
