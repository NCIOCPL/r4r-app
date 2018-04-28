import { updateSearchBar } from '../searchForm/actions';
import {
    formatRawResourcesFacets,
    composeQueryString,
} from '../../utilities';
import {
    timedFetch,
    handleRequest,
    handleNetworkFailure,
} from '../../utilities/fetchHelpers'

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
    const queryString = '?size=0&includeFacets=toolType.type&includeFacets=researchAreas';
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
    
    // Add in http error handling  
    fetch(queryEndpoint)
        .then(res => res.json())
        .then(res => console.log(res))
    // Fetch facets and load them. The home component will render them as soon as they become available.
    console.log('Fetching facets')
    dispatch(setFacetsFetchingStatus(true));
    setTimeout(() => {
        const dummyFacets = dummyFacetResults.facets;
        const formattedFacets = formatRawResourcesFacets(dummyFacets)
        dispatch(loadNewFacetResults(formattedFacets));
    }, 1000)
}

//TODO: Need to rewrite this to allow for cases where the call is being made as part of a prefetch
// cycle and even though the results are new we don't want to navigate.

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
    dispatch(setCurrentSearchText(searchText));
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
    }
    // Fetch new results from api
    // Restructure facets to match rendering expectations (array => hashmap)
    // Store new results to cache with a key of querystring unparsed
    // TODO: Need to have a size limit on the cache (either number of records or memory footprint (which
    // might invite using an array instead of hash to have better replication of a heap))

    //TODO: This won't work on new filters where the search isn't cached but we don't want to redirect
    console.log('Current search is not cached, fetching from db')
    dispatch(setFetchingStatus(true));

    console.log('Fetching from API')
    // Add in http error handling  
    
    timedFetch(API_resourcesEndpoint + newQueryString, 2000)
        .catch(handleNetworkFailure)
        .then(handleRequest)
        .then(res => {
            const rawFacets = res.facets;
            const formattedFacets = formatRawResourcesFacets(rawFacets)
            const processedResults = {
                ...res,
                facets: formattedFacets,
            };
            const resultsToCache = {
                [newQueryString]: processedResults,
            }
            console.log(processedResults)
    
            dispatch(cacheNewSearchResults(resultsToCache));
            dispatch(cacheResources(res.results));
            dispatch(setCurrentSearchQueryString(newQueryString))
            dispatch(loadNewSearchResults(processedResults));
            if(!isAlreadyAtCorrectURL) {
                console.log('navigating to search page')
                history.push(`/search${ newQueryString }`)
            }            
        })
        .catch(err => {
            if(err.timeoutError){
                console.log(err.timeoutError);
            }
            else {
                console.log(err.statusText)
            }
            //TODO: Redirect to error page and cancel fetch in store
        })
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

    // We need to fetch and process the resource from the /resource api endpoint. For now we
    // will use dummy + setTimeout
    console.log('Resource not cached, fetching from db')
    fetch(API_resourceEndpoint + resourceId)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            dispatch(cacheResources([res]));
            dispatch(loadResource(res));

        })
}

// // Pre-processed
const dummyFacetResults = {
	"meta": {
        "totalResults": 168,
        "from": 40
	},
	"results": [],
	"facets": [{
		"title": "Tool Types",
		"param": "toolTypes",
		"items": [
			{
				"key": "datasets_databases",
				"label": "Datasets & Databases",
				"count": 10,
				"selected": false
			},
			{
				"key": "lab_tools",
				"label": "Lab Tools",
				"count": 27,
				"selected": false
			},			
			{
				"key": "community_research_tools",
				"label": "Community Research Tools",
				"count": 10,
				"selected": false
			},
			{
				"key": "clinical_research_tools",
				"label": "Clinical Research Tools",
				"count": 27,
				"selected": false
			},			
			{
				"key": "analysis_tools",
				"label": "Analysis Tools",
				"count": 10,
				"selected": false
			},
			{
				"key": "terminology",
				"label": "Terminology",
				"count": 27,
				"selected": false
			},			
		]
	},
	{
		"title": "Research Areas",
		"param": "researchAreas",
		"items": [
			{
				"key": "cancer_prevention",
				"label": "Cancer Prevention",
				"count": 32,
				"selected": false
			},
			{
				"key": "cancer_genomics",
				"label": "Cancer Genomics",
				"count": 2,
				"selected": false
			},
			{
				"key": "cancer_treatment",
				"label": "Cancer Treatment",
				"count": 32,
				"selected": false
			},
			{
				"key": "cancer_omics",
				"label": "Cancer Omics",
				"count": 2,
				"selected": false
			},
			{
				"key": "screening_detection",
				"label": "Screening & Detection",
				"count": 32,
				"selected": false
			},
			{
				"key": "cancer_health_disparities",
				"label": "Cancer Health Disparities",
				"count": 2,
				"selected": false
			},
			{
				"key": "cancer_public_health",
				"label": "Cancer & Public Health",
				"count": 32,
				"selected": false
			},
			{
				"key": "cancer_diagnosis",
				"label": "Cancer Diagnosis",
				"count": 2,
				"selected": false
			},
			{
				"key": "cancer_causes",
				"label": "Causes of Cancer",
				"count": 32,
				"selected": false
			},
			{
				"key": "cancer_survivorship",
				"label": "Cancer Survivorship",
				"count": 2,
				"selected": false
			},
		]
	}
	]
}
