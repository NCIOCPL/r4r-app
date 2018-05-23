import {
    formatRawResourcesFacets,
    composeQueryString,
    reconstituteSearchResultsFromCache,
} from '../../utilities';
import {
    timedFetch,
    handleResponse,
    handleNetworkFailure,
    constructErrorMessage,
} from '../../utilities/fetchHelpers';
import {
    validateSearchResponse,
    validateSearchRequest,
} from '../../utilities/validation';
import {
    push,
} from 'react-router-redux';

export const CLEAR_FILTERS = "CLEAR FILTERS";
export const UPDATE_FILTER = "UPDATE FILTER";
export const LOAD_RESOURCE = "LOAD RESOURCE";
export const CACHE_RESOURCES = "CACHE RESOURCES";
export const FETCHING_STATUS = "FETCHING STATUS";
export const UNMOUNT_RESULTS_VIEW = "UNMOUNT_RESULTS_VIEW";
export const UPDATE_TOOLTYPE_FILTER = "UPDATE TOOLTYPE FILTER";
export const LOAD_NEW_FACET_RESULTS = "LOAD NEW FACET RESULTS";
export const LOAD_NEW_SEARCH_RESULTS = "LOAD NEW SEARCH RESULTS";
export const SET_CURRENT_SEARCH_TEXT = "SET CURRENT SEARCH TEXT";
export const CACHE_NEW_SEARCH_RESULTS = "CACHE NEW SEARCH RESULTS";

export const setFetchingStatus = (isFetching, fetchId = null) => ({
    type: FETCHING_STATUS,
    payload: {
        isFetching,
        fetchId,
    }
});

export const cacheResources = resources => {
    const processedResources = resources.reduce((acc, resource) => {
        acc[resource.id] = resource;
        return acc
    }, {});
    
    return {
        type: CACHE_RESOURCES,
        payload: processedResources,
    }
};

export const loadResource = resource => ({
    type: LOAD_RESOURCE,
    payload: resource,
});

export const loadNewSearchResults = ({ results, newQueryString }) => ({
    type: LOAD_NEW_SEARCH_RESULTS,
    payload: {
        results,
        newQueryString,
    }
});

export const cacheNewSearchResults = results => ({
    type: CACHE_NEW_SEARCH_RESULTS,
    payload: results,
});

export const loadNewFacetResults = results => ({
    type: LOAD_NEW_FACET_RESULTS,
    payload: results,
});

export const setCurrentSearchText = searchText => ({
    type: SET_CURRENT_SEARCH_TEXT,
    payload: searchText,
});

// This is a wrapper around the push action creator from the react-router-redux library
export const searchRedirect = searchParams => {
    searchParams = validateSearchRequest(searchParams);
    const queryString = composeQueryString(searchParams);
    return push(`/search${ queryString }`);
};

// Tooltypes are a special case because when we clear a selected tooltype
// we want to also clear all currently checked toolsubtypes. We can clear all toolsubtypes
// regardless of what state the tooltype is switching to because if it's being unchecked
// all toolsubtypes need to be cleared, and if it's being checked then we can assume that
// no toolsubtypes had been selected yet.
export const updateFilter = (filterType, filter) => {
    return filterType === 'toolTypes'
    ?
        {
            type: UPDATE_TOOLTYPE_FILTER,
            payload: {
                filter,
            },
        }
    :
        {
            type: UPDATE_FILTER,
            payload: {
                filterType,
                filter,
            },
        }
};

export const clearFilters = () => ({
    type: CLEAR_FILTERS,
});

export const unmountResultsView = () => ({
    type: UNMOUNT_RESULTS_VIEW,
});

/**
 * 
 * @param {Object} searchParams
 */
export const newSearch = searchParams => (dispatch, getState, { history, apiEndpoint }) => {
    // const store = getState();

    // //TODO: Can we just refactor this to wrap the fetch middleware?
    // // Do we care if things are reloaded from the cache?
    // // Error Prevention: Do not allow multiple fetchs to be executed in parallel.
    // if(store.api.isFetching){
    //     console.log('Already fetching. Aborting.');
    //     return;
    // }
    
    // TODO: Can even the searches on the results page just redirect? And only have the
    // real newsearch called in the lifecycle functions??
    // Any cleanup prerequest should be done through utility functions inside this call
    searchParams = validateSearchRequest(searchParams);
    const newQueryString = composeQueryString(searchParams);
    
    // TODO: Does this line still work??
    const isAlreadyAtCorrectURL = history.location.search === newQueryString;
    
    // We only want to retain search text on the results page (otherwise stale text will be visible on page changes)
    const searchText = searchParams.q || '';
    dispatch(setCurrentSearchText(searchText));
    
    // 1) Current search is the same as the last. 
    // We only need to determine whether or not to navigate manually.
    // If we are already on the search page and the searches match we don't do anything because we assume we are
    // already viewing the results we want and they are cached.
    // If we aren't on the search page we will delegate control to the second path which checks the cache and can
    // manually navigate.
    const store = getState();
    const currentSearchQueryString = store.api.currentSearchQueryString;
    if(newQueryString === currentSearchQueryString) {
        console.log('Current search matches last search, reusing results');
        return
        // DEPRECATED SINCE THIS WILL ALWAYS BE CALLED ON THE SEARCH PAGE NOW
        // const isAlreadyOnSearchPage = history.location.pathname.toLowerCase() === '/search';
        // if(isAlreadyOnSearchPage) {
        //     return;
        // }
    }
    
    // 2) Search does not match previous search.
    // We check the current cache to see if the search has already been executed in the past (especially useful
    // for user navigation/paging). If it is we also need to check if we are already at the correct url (this is 
    // an error case since a new search should imply a new query string in the url) and navigate manually accordingly.
    // If the search isn't cached it's a new search, which takes us to the third and final path.
    // const store = getState();
    const searchCache = store.cache.cachedSearches;
    const isCached = searchCache.hasOwnProperty(newQueryString);
    if(isCached) {
        console.log('Current search is already cached, loading from cache')
        const cache = getState().cache;
        const reconstitutedResults = reconstituteSearchResultsFromCache(newQueryString, cache);
        dispatch(loadNewSearchResults({ results: reconstitutedResults, newQueryString }));
        if(isAlreadyAtCorrectURL){
            console.log('iscached: Is already at correct url')
            return;
        }
        dispatch(push(`/search${ newQueryString }`));
        return;
    }

    // 3) Search is not cached - API Request
    console.log('Search not cached. Fetching from API');
    const fetchId = Date.now();
    dispatch(setFetchingStatus(true, fetchId));

    timedFetch(apiEndpoint + '/resources' + newQueryString)
        .catch(handleNetworkFailure)
        .then(handleResponse)
        .then(validateSearchResponse)
        .then(res => {
            if(getState().api.fetchId === fetchId){ // TODO: This line is removable when the middleware is used
                dispatch(cacheResources(res.results));
    
                // Search results will be processed to
                // a) convert facets into a map for easy lookups
                const processedResults = {
                    ...res,
                    facets: formatRawResourcesFacets(res.facets),
                };
                dispatch(loadNewSearchResults({ results: processedResults, newQueryString }));
                // b) replace full resources with just id of resources
                const strippedResults = {
                    ...processedResults,
                    results: processedResults.results.map(resource => resource.id),
                };
                dispatch(cacheNewSearchResults({ [newQueryString]: strippedResults }));
                // When a searchresult is loaded, the resources will be repopulated from the resource cache.
                // This avoids a lot of duplication in the results cache.
    
                if(!isAlreadyAtCorrectURL) {
                    dispatch(push(`/search${ newQueryString }`));
                };
            }
        })
        .catch(err => constructErrorMessage(err, dispatch));
}

export const fetchResource = (resourceId) => ({
    type: '@@cache/RETRIEVE',
    cache: {
        cacheType: 'RESOURCE',
        cacheKey: resourceId,
        onCached: dispatch => resource => dispatch(loadResource(resource)),
    },
    fetch: {
        url: '/resource/' + resourceId,
        onSuccess: dispatch => res => {
            dispatch(cacheResources([res]));
            dispatch(loadResource(res));
        },
    },
    // TODO: This meta is redundant now with location reporting through react-router-redux
    // But I'm leaving it as a placeholder for more useful meta data we might want to add
    meta: {
        eventType: 'PAGE_LOAD',
        currentView: 'RESOURCE'
    }
});

export const loadFacets = () => ({
    type: '@@cache/RETRIEVE',
    cache: {
        cacheType: 'FACETS',
        onCached: () => {},
    },
    fetch: {
        url: '/resources?size=0&includeFacets=toolTypes&includeFacets=researchAreas',
        onSuccess: dispatch => res => {
            const formattedFacets = formatRawResourcesFacets(res.facets);
            dispatch(loadNewFacetResults(formattedFacets));
        }
    },
    // TODO: This meta is redundant now with location reporting through react-router-redux
    meta: {
        eventType: 'PAGE_LOAD',
        currentView: 'HOME',
    }
});

// TODO: Rewrite newsearch as messaging chain
// export const newSearch = () => ({

// })