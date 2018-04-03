import history from '../../history';
import { updateSearchBar } from '../searchForm/actions';
import {
    formatRawResourcesFacets,
    composeQueryString,
} from '../../utilities';

export const UPDATE_FILTER = "UPDATE FILTER";
export const LOAD_RESOURCE = "LOAD RESOURCE";
export const CACHE_RESOURCES = "CACHE RESOURCES";
export const FETCHING_STATUS = "FETCHING STATUS";
export const LOAD_NEW_FACET_RESULTS = "LOAD NEW FACET RESULTS";
export const LOAD_NEW_SEARCH_RESULTS = "LOAD NEW SEARCH RESULTS";
export const SET_CURRENT_SEARCH_TEXT = "SET CURRENT SEARCH TEXT";
export const CACHE_NEW_SEARCH_RESULTS = "CACHE NEW SEARCH RESULTS";
export const SET_CURRENT_SEARCH_QUERY_STRING = "SET CURRENT SEARCH QUERY STRING";

const setFetchingStatus = status => ({
    type: FETCHING_STATUS,
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

export const updateFilter = (filterType, filter) => ({
    type: UPDATE_FILTER,
    payload: {
        filterType,
        filter,
    },
})

// When the home page loads, we want to fetch all available facets to use for dynamically
// rendering the browse tiles.
export const loadFacets = () => (dispatch, getState) => {
    const queryString = '?size=0&includeFacets=toolType.type&includeFacets=researchAreas';
    // This process can be abstracted into a generic load from cache method to be shared (later)
    const store = getState();

    // We want this to be a cheap lookup to see if a facets object exists, the only way to load one
    // will be after a successfull fetch so we shouldn't need to do any additional validation.
    const isCached = store.api.referenceFacets;
    if(isCached){
        console.log('Facets are cached already.')
        return;
    }
    console.log('Fetching facets')
    // Fetch facets and load them. The home component will render them as soon as they become available.
    setTimeout(() => {
        //We'll also want to process the returned results into a hashmap for easier lookup by the rendering
        //components. For now my dummy represents the already processed structure.
        // processFacetResultsOnSuccessfulFetch()
        const dummyFacets = dummyFacetResults.facets;
        const formattedFacets = formatRawResourcesFacets(dummyFacets)
        dispatch(loadNewFacetResults(formattedFacets));
    }, 0)
}

// Need to rewrite this to allow for cases where the call is being made as part of a prefetch
// cycle and even though the results are new we don't want to navigate.

// TODO: Fix issue with double fire and double redirect. Currently it is triple firing because of the dummy data overwriting changes, when it has a dynamic return
// we need to see if the issue persists.
export const newSearch = searchParams => (dispatch, getState) => {
    const store = getState();
    const currentSearchQueryString = store.api.currentSearchQueryString;
    const searchCache = store.api.cachedSearches;
    const searchText = searchParams.q || '';
    dispatch(setCurrentSearchText(searchText));
    const newQueryString = composeQueryString(searchParams);
    const isCached = searchCache.hasOwnProperty(newQueryString);
    const isAlreadyOnSearchPage = history.location.pathname.toLowerCase() === '/search';
    const isAlreadyAtCorrectURL = history.location.search === newQueryString;

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
    setTimeout(() => {
        // TODO: FETCH DATA
        console.log('Fetching from API')
        const rawFacets = dummyResults.facets;
        const formattedFacets = formatRawResourcesFacets(rawFacets)
        const processedResults = {
            ...dummyResults,
            facets: formattedFacets,
        };
        const resultsToCache = {
            [newQueryString]: processedResults,
        }

        dispatch(cacheNewSearchResults(resultsToCache));
        dispatch(cacheResources(dummyResults.results));
        dispatch(setCurrentSearchQueryString(newQueryString))
        dispatch(loadNewSearchResults(processedResults));
        dispatch(setFetchingStatus(false));
        if(!isAlreadyAtCorrectURL) {
            console.log('navigating to search page')
            history.push(`/search${ newQueryString }`)
        }
    }, 0);
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
    setTimeout(() => {
        //TODO: 1) Fetch resource
        console.log('Resource not cached, fetching from db')
        dispatch(cacheResources([dummyResourceResult]));
        dispatch(loadResource(dummyResourceResult));
    }, 1000)
}

const dummyResults = {
    "meta": {
		"totalResults": 168
	},
    "results": [
        {
            id: '123',
            title: 'Chernobyl Tissue Bank',
            website: 'https://en.wikipedia.org/wiki/Chernobyl',
            description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
            pocs: [
                {
                    name: {
                        prefix: 'Dr.',
                        firstName: 'James',
                        middleName: 'Randy',
                        lastName: 'Knowlton',
                        suffix: 'Ph.D.',
                    },
                    title: 'Program Director',
                    phone: '240-276-6210',
                    email: 'Jk339o@nih.gov',
                },
            ],
            resourceAccess: {
                type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
                notes: 'Registrants will have to provide grantee institution name.',
            },
            // Make component for these things.
            // The click event should be passed though, so that on the resource page it can trigger a new search
            // with just the filter, and on other pages it triggers a full-filter and text search.
            toolTypes: [
    
            ],
            researchAreas: [
    
            ],
            researchTypes: [
    
            ]
        },
        {
            id: '456',
            title: 'Chernobyl Tissue Bank',
            website: 'https://en.wikipedia.org/wiki/Chernobyl',
            description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
            pocs: [
                {
                    name: {
                        prefix: 'Dr.',
                        firstName: 'James',
                        middleName: 'Randy',
                        lastName: 'Knowlton',
                        suffix: 'Ph.D.',
                    },
                    title: 'Program Director',
                    phone: '240-276-6210',
                    email: 'Jk339o@nih.gov',
                },
            ],
            resourceAccess: {
                type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
                notes: 'Registrants will have to provide grantee institution name.',
            },
            // Make component for these things.
            // The click event should be passed though, so that on the resource page it can trigger a new search
            // with just the filter, and on other pages it triggers a full-filter and text search.
            "toolTypes": [
                {
                    "type": {
                      "key": "datasets_databases",
                      "label": "Datasets & Databases"
                    },
                    "subtype": {
                      "key": "genomic_datasets",
                      "label": "genomic datasets"
                    }
                },
                {
                    "type": {
                      "key": "analysis_tools",
                      "label": "Analysis Tools"
                    }
                }
            ],
            'researchAreas': [
                {
                    'key': 'cancer_treatment',
                    'label': 'Cancer Treatment'
                },
                {
                    'key': 'cancer_biology',
                    'label': 'Cancer Biology'
                },            
            ],
            'researchTypes': [
        
            ]
        },
        {
            id: '789',
            title: 'Chernobyl Tissue Bank',
            website: 'https://en.wikipedia.org/wiki/Chernobyl',
            description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
            pocs: [
                {
                    name: {
                        prefix: 'Dr.',
                        firstName: 'James',
                        middleName: 'Randy',
                        lastName: 'Knowlton',
                        suffix: 'Ph.D.',
                    },
                    title: 'Program Director',
                    phone: '240-276-6210',
                    email: 'Jk339o@nih.gov',
                },
            ],
            resourceAccess: {
                type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
                notes: 'Registrants will have to provide grantee institution name.',
            },
            // Make component for these things.
            // The click event should be passed though, so that on the resource page it can trigger a new search
            // with just the filter, and on other pages it triggers a full-filter and text search.
            "toolTypes": [
                {
                    "type": {
                      "key": "datasets_databases",
                      "label": "Datasets & Databases"
                    },
                    "subtype": {
                      "key": "genomic_datasets",
                      "label": "genomic datasets"
                    }
                },
                {
                    "type": {
                      "key": "analysis_tools",
                      "label": "Analysis Tools"
                    }
                }
            ],
            'researchAreas': [
                {
                    'key': 'cancer_treatment',
                    'label': 'Cancer Treatment'
                },
                {
                    'key': 'cancer_biology',
                    'label': 'Cancer Biology'
                },            
            ],
            'researchTypes': [
        
            ]
        },
        {
            id: '07734',
            title: 'Chernobyl Tissue Bank',
            website: 'https://en.wikipedia.org/wiki/Chernobyl',
            description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
            pocs: [
                {
                    name: {
                        prefix: 'Dr.',
                        firstName: 'James',
                        middleName: 'Randy',
                        lastName: 'Knowlton',
                        suffix: 'Ph.D.',
                    },
                    title: 'Program Director',
                    phone: '240-276-6210',
                    email: 'Jk339o@nih.gov',
                },
            ],
            resourceAccess: {
                type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
                notes: 'Registrants will have to provide grantee institution name.',
            },
            // Make component for these things.
            // The click event should be passed though, so that on the resource page it can trigger a new search
            // with just the filter, and on other pages it triggers a full-filter and text search.
            "toolTypes": [
                {
                    "type": {
                      "key": "datasets_databases",
                      "label": "Datasets & Databases"
                    },
                    "subtype": {
                      "key": "genomic_datasets",
                      "label": "genomic datasets"
                    }
                },
                {
                    "type": {
                      "key": "analysis_tools",
                      "label": "Analysis Tools"
                    }
                }
            ],
            'researchAreas': [
                {
                    'key': 'cancer_treatment',
                    'label': 'Cancer Treatment'
                },
                {
                    'key': 'cancer_biology',
                    'label': 'Cancer Biology'
                },            
            ],
            'researchTypes': [
        
            ]
        },
    ],
	"facets": [
        {
            "title": "Tool Types",
            "param": "toolTypes.type",
            "items": [
                {
                    "key": "datasets_databases",
                    "label": "Datasets & Databases",
                    "count": '10',  //TODO: Convert to number
                    "selected": false //TODO: Convert to bool
                },
                {
                    "key": "lab_tools",
                    "label": "Lab Tools",
                    "count": '27',
                    "selected": false
                },			
            ]
        },
        {
            "title": "Subtool Types",
            "param": "toolTypes.subtype",
            "items": [
                {
                    "key": "datasets_databases",
                    "label": "Chicken and Cows",
                    "count": '10',  //TODO: Convert to number
                    "selected": false //TODO: Convert to bool
                },
                {
                    "key": "lab_tools",
                    "label": "Lab Tools",
                    "count": '27',
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
                    "count": '32',
                    "selected": false
                },
                {
                    "key": "cancer_genomics",
                    "label": "Cancer Genomics",
                    "count": '2',
                    "selected": false
                },
                {
                    'key': 'cancer_treatment',
                    'label': 'Cancer Treatment',
                    'count': '1',
                    'selected': false,
                },
                {
                    'key': 'cancer_biology',
                    'label': 'Cancer Biology',
                    'count': '1',
                    'selected': false,
                },
                {
                    'key': 'cancer_omics',
                    'label': 'Cancer Omics',
                    'count': '1',
                    'selected': false,
                },
                
            ]
        },
        {
            'title': 'Research Types',
            'param': 'researchTypes',
            'items':	[
                {
                    'key': 'bananas',
                    'label': 'Bananas R Us',
                    'count': '1',
                    'selected': false,
                },
            ]  
        }
	]
}

// Pre-processed
const dummyFacetResults = {
	"meta": {
		"totalResults": 168
	},
	"results": [],
	"facets": [{
		"title": "Tool Types",
		"param": "toolTypes.type",
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
		]
	}
	]
}

const dummyResourceResult = {
    id: '123',
    title: 'Chernobyl Tissue Bank',
    website: 'https://en.wikipedia.org/wiki/Chernobyl',
    description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
    pocs: [
        {
            name: {
                prefix: 'Dr.',
                firstName: 'James',
                middleName: 'Randy',
                lastName: 'Knowlton',
                suffix: 'Ph.D.',
            },
            title: 'Program Director',
            phone: '240-276-6210',
            email: 'Jk339o@nih.gov',
        },
    ],
    resourceAccess: {
        type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
        notes: 'Registrants will have to provide grantee institution name.',
    },
    // Make component for these things.
    // The click event should be passed though, so that on the resource page it can trigger a new search
    // with just the filter, and on other pages it triggers a full-filter and text search.

    "toolTypes": [
        {
            "type": {
              "key": "datasets_databases",
              "label": "Datasets & Databases"
            },
            "subtype": {
              "key": "genomic_datasets",
              "label": "genomic datasets"
            }
        },
        {
            "type": {
              "key": "analysis_tools",
              "label": "Analysis Tools"
            }
        }
    ],
    'researchAreas': [
        {
            'key': 'cancer_treatment',
            'label': 'Cancer Treatment'
        },
        {
            'key': 'cancer_biology',
            'label': 'Cancer Biology'
        },            
    ],
    'researchTypes': [

    ]
}