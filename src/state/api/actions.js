import {
    formatRawResourcesFacets,
    composeQueryString,
    reconstituteSearchResultsFromCache,
} from '../../utilities';
import {
    validateSearchRequest,
    validateQueryStringSearchRequest,
} from '../../utilities/validation';
import {
    push,
} from 'react-router-redux';

export const LOAD_RESOURCE = "LOAD RESOURCE";
export const CACHE_RESOURCES = "CACHE RESOURCES";
export const FETCHING_STATUS = "FETCHING STATUS";
export const UNMOUNT_RESULTS_VIEW = "UNMOUNT_RESULTS_VIEW";
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

export const loadNewSearchResults = (results, newQueryString) => ({
    type: LOAD_NEW_SEARCH_RESULTS,
    payload: {
        results,
        newQueryString,
    }
});

// Replace full resources with just ids of resources before caching to save memory
export const cacheNewSearchResults = (res, queryString) => ({
    type: CACHE_NEW_SEARCH_RESULTS,
    payload: {
        [queryString]: {
            ...res,
            results: res.results.map(resource => resource.id),
        }
    }
});

export const loadNewFacetResults = results => ({
    type: LOAD_NEW_FACET_RESULTS,
    payload: results,
});

export const setCurrentSearchText = searchText => ({
    type: SET_CURRENT_SEARCH_TEXT,
    payload: searchText,
});

export const unmountResultsView = () => ({
    type: UNMOUNT_RESULTS_VIEW,
});

// This is a wrapper around the push action creator from the react-router-redux library
export const searchRedirect = searchParams => {
    searchParams = validateSearchRequest(searchParams);
    const queryString = composeQueryString(searchParams);
    return push(`/search${ queryString }`);
};

export const fetchResource = (resourceId) => ({
    type: '@@cache/RETRIEVE',
    cache: {
        cacheType: 'RESOURCE',
        cacheKey: resourceId,
        onCached: (dispatch, getState) => resource => dispatch(loadResource(resource)),
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
        onCached: () => () => {},
    },
    fetch: {
        url: '/resources?size=0&includeFacets=toolTypes&includeFacets=researchAreas',
        onSuccess: dispatch => res => {
            dispatch(loadNewFacetResults(res.facets));
        }
    },
});

/**
 * Wrapper around new resources search to allow for validation
 * 
 * @param {string} queryString 
 * @return {Object} redux action
 */
export const validatedNewSearch = queryString => {
    const validatedQueryString = validateQueryStringSearchRequest(queryString);
    return newSearch(validatedQueryString);
}

export const newSearch = queryString => ({
    type: '@@cache/RETRIEVE',
    cache: {
        cacheType: 'RESOURCES',
        cacheKey: queryString,
        onCached: (dispatch, getState) => cachedSearch => {
            const cachedResources = getState().cache.cachedResources;
            const reconstitutedResults = reconstituteSearchResultsFromCache(cachedSearch, cachedResources);
            dispatch(loadNewSearchResults(reconstitutedResults, queryString));        
        },
    },
    fetch: {
        url: `/resources${ queryString }`,
        onSuccess: dispatch => res => {
            dispatch(cacheResources(res.results));
            dispatch(cacheNewSearchResults(res, queryString));
            dispatch(loadNewSearchResults(res, queryString));
        }
    }
})