import history from '../../history';
import { updateSearchBar } from '../searchForm/actions';
import {
    formatRawResourcesFacets,
} from '../../utilities';

export const CACHE_RESOURCE = "CACHE RESOURCE";
export const LOAD_RESOURCE = "LOAD RESOURCE";
export const FETCHING_STATUS = "FETCHING STATUS";
export const LOAD_NEW_FACET_RESULTS = "LOAD NEW FACET RESULTS";
export const LOAD_NEW_SEARCH_RESULTS = "LOAD NEW SEARCH RESULTS";
export const CACHE_NEW_SEARCH_RESULTS = "CACHE NEW SEARCH RESULTS";

const setFetchingStatus = status => ({
    type: FETCHING_STATUS,
    payload: status,
})

const cacheResource = resource => ({
    type: CACHE_RESOURCE,
    payload: resource,
})

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
        console.log('Facets are cached already. Exiting.')
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

// TODO: Fix issue with double fire and double redirect. TODO: did I already fix it? Comments get 
// stale quick!
export const newSearch = newQueryString => (dispatch, getState) => {
    const store = getState();
    const currentSearchQueryString = store.api.currentSearchQueryString;
    const searchCache = store.api.cachedSearches;
    const isCached = searchCache.hasOwnProperty(newQueryString);
    const isAlreadyOnSearchPage = history.location.pathname.toLowerCase() === '/search';
    const isAlreadyAtCorrectURL = history.location.search === newQueryString;

    if(newQueryString === currentSearchQueryString) {
        console.log('Current search matches last search, reusing results')
        if(isAlreadyOnSearchPage) {
            return;
        }
    }
    if(isCached) {
        console.log('Current search is already cached, loading from cache')
        // Set currentresults to cache
        // 1) set results to currentResults
        const cachedResults = searchCache[newQueryString];
        dispatch(loadNewSearchResults(cachedResults));
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
        dispatch(loadNewSearchResults(processedResults));
        dispatch(setFetchingStatus(false));
        dispatch(updateSearchBar(''));
        if(!isAlreadyAtCorrectURL) {
            console.log('navigating to search page')
            history.push(`/search${ newQueryString }`)
        }
    }, 1000);
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
        dispatch(cacheResource(dummyResourceResult));
        dispatch(loadResource(dummyResourceResult));
    }, 2000)
}

export const captureFilterState = () => (dispatch, getState) => {
    const store = getState();
    const filterStates = store.api.currentFacets;
    console.log(filterStates)
}

// const dummyResults = {
//     results: [
//         {
//             id: '123',
//             title: 'Chernobyl Tissue Bank',
//             website: 'https://en.wikipedia.org/wiki/Chernobyl',
//             description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
//             pocs: [
//                 {
//                     name: {
//                         prefix: 'Dr.',
//                         firstName: 'James',
//                         middleName: 'Randy',
//                         lastName: 'Knowlton',
//                         suffix: 'Ph.D.',
//                     },
//                     title: 'Program Director',
//                     phone: '240-276-6210',
//                     email: 'Jk339o@nih.gov',
//                 },
//             ],
//             resourceAccess: {
//                 type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
//                 notes: 'Registrants will have to provide grantee institution name.',
//             },
//             // Make component for these things.
//             // The click event should be passed though, so that on the resource page it can trigger a new search
//             // with just the filter, and on other pages it triggers a full-filter and text search.
//             toolTypes: [
    
//             ],
//             researchAreas: [
    
//             ],
//             researchTypes: [
    
//             ]
//         },
//         {
//             id: '123',
//             title: 'Chernobyl Tissue Bank',
//             website: 'https://en.wikipedia.org/wiki/Chernobyl',
//             description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
//             pocs: [
//                 {
//                     name: {
//                         prefix: 'Dr.',
//                         firstName: 'James',
//                         middleName: 'Randy',
//                         lastName: 'Knowlton',
//                         suffix: 'Ph.D.',
//                     },
//                     title: 'Program Director',
//                     phone: '240-276-6210',
//                     email: 'Jk339o@nih.gov',
//                 },
//             ],
//             resourceAccess: {
//                 type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
//                 notes: 'Registrants will have to provide grantee institution name.',
//             },
//             // Make component for these things.
//             // The click event should be passed though, so that on the resource page it can trigger a new search
//             // with just the filter, and on other pages it triggers a full-filter and text search.
//             toolTypes: [
    
//             ],
//             researchAreas: [
    
//             ],
//             researchTypes: [
    
//             ]
//         },
//         {
//             id: '123',
//             title: 'Chernobyl Tissue Bank',
//             website: 'https://en.wikipedia.org/wiki/Chernobyl',
//             description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
//             pocs: [
//                 {
//                     name: {
//                         prefix: 'Dr.',
//                         firstName: 'James',
//                         middleName: 'Randy',
//                         lastName: 'Knowlton',
//                         suffix: 'Ph.D.',
//                     },
//                     title: 'Program Director',
//                     phone: '240-276-6210',
//                     email: 'Jk339o@nih.gov',
//                 },
//             ],
//             resourceAccess: {
//                 type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
//                 notes: 'Registrants will have to provide grantee institution name.',
//             },
//             // Make component for these things.
//             // The click event should be passed though, so that on the resource page it can trigger a new search
//             // with just the filter, and on other pages it triggers a full-filter and text search.
//             toolTypes: [
    
//             ],
//             researchAreas: [
    
//             ],
//             researchTypes: [
    
//             ]
//         },
//         {
//             id: '123',
//             title: 'Chernobyl Tissue Bank',
//             website: 'https://en.wikipedia.org/wiki/Chernobyl',
//             description: 'DCB supports and manages biospecimen resources that collect, store, process, and disseminate human biological specimens (biospecimens) and associated data set for research on human cancer biology. The Chernobyl Tissue Bank is an international collaborative project that is supported by NCI and another global partner, with active participation from Russia and Ukraine, two countries heavily affected by the 1986 Chernobyl accident.\nThe objective of the CTB is to establish and maintain a research resource that supports studies on the biology of thyroid cancer, the major health consequence of the Chernobyl accident.    For more information on this Tissue Bank, please visit the Chernobyl Tissue Bank website.',
//             pocs: [
//                 {
//                     name: {
//                         prefix: 'Dr.',
//                         firstName: 'James',
//                         middleName: 'Randy',
//                         lastName: 'Knowlton',
//                         suffix: 'Ph.D.',
//                     },
//                     title: 'Program Director',
//                     phone: '240-276-6210',
//                     email: 'Jk339o@nih.gov',
//                 },
//             ],
//             resourceAccess: {
//                 type: 'Requires Registration', // If this is effectively a key or id, maybe it should have one for the logo to hook into
//                 notes: 'Registrants will have to provide grantee institution name.',
//             },
//             // Make component for these things.
//             // The click event should be passed though, so that on the resource page it can trigger a new search
//             // with just the filter, and on other pages it triggers a full-filter and text search.
//             toolTypes: [
    
//             ],
//             researchAreas: [
    
//             ],
//             researchTypes: [
    
//             ]
//         },
//     ],
//     //The tooltype itself should have a flag for selected so we can more easily jump to subtool type.
//     facets: {
//         'toolTypes': {
//             title: 'Tool Type',
//             param: 'toolType.type',
//             items:	[
//                 {
//                     key: 'sdsdff5asdf',
//                     label: 'Reagents',
//                     count: '12',
//                     selected: false,
//                 },
//                 {
//                     key: 'sdf234asdf',
//                     label: 'Biospecimen',
//                     count: '4',
//                     selected: false,
//                 },
//                 {
//                     key: 'sdfa2sdfasdf',
//                     label: 'Assays',
//                     count:'2',
//                     selected: false,
//                 },
//                 {
//                     key: 'weqwd',
//                     label: 'Cell lines',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: '3neui7u',
//                     label: 'Protocols',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'uytbr45',
//                     label: 'Animal models',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'n79nmds',
//                     label: 'Plant Samples',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'm99unn',
//                     label: 'Vectors',
//                     count: '1',
//                     selected: false,
//                 },
//             ]                
//         },
//         'st': {
//             title: 'Subtool Type',
//             param: 'st',
//             items:	[
//                 {
//                     key: 'sdsdff5asdf',
//                     label: 'Reagents',
//                     count: '12',
//                     selected: false,
//                 },
//                 {
//                     key: 'sdf234asdf',
//                     label: 'Biospecimen',
//                     count: '4',
//                     selected: false,
//                 },
//                 {
//                     key: 'sdfa2sdfasdf',
//                     label: 'Assays',
//                     count:'2',
//                     selected: true,
//                 },
//                 {
//                     key: 'weqwd',
//                     label: 'Cell lines',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: '3neui7u',
//                     label: 'Protocols',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'uytbr45',
//                     label: 'Animal models',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'n79nmds',
//                     label: 'Plant Samples',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'm99unn',
//                     label: 'Vectors',
//                     count: '1',
//                     selected: false,
//                 },
//             ]                
//         },
//         'ra': {
//             title: 'Research Area',
//             param: 'ra',
//             items:	[
//                 {
//                     key: '1234',
//                     label: 'Cancer Treatment',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: '32423',
//                     label: 'Cancer Biology',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: '4',
//                     label: 'Cancer Omics',
//                     count: '1',
//                     selected: true,
//                 },
//                 {
//                     key: '23423',
//                     label: 'Screening & Detection',
//                     count: '12',
//                     selected: true,
//                 },
//                 {
//                     key: '656u5',
//                     label: 'Cancer Health Disparities',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: '5ge5',
//                     label: 'Cancer & Public Health',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: '5bferd',
//                     label: 'Cancer Statistics',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'okjyu7',
//                     label: 'Cancer Diagnosis',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: '4crc',
//                     label: 'Cancer Screening & Detection',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'lkjhg',
//                     label: 'Causes of Cancer',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'cderfd',
//                     label: 'Cancer Survivorship',
//                     count: '1',
//                     selected: false,
//                 },
//                 {
//                     key: 'dftre',
//                     label: 'Cancer Prevention',
//                     count: '1',
//                     selected: false,
//                 },
//             ]  
//         },
//         'rt': {
//             title: 'Research Type',
//             param: 'rt',
//             items:	[
//                 {
//                     key: '',
//                     label: 'Bananas R Us',
//                     count: '1',
//                     selected: true,
//                 },
//             ]  
//         }
//     }
// }
    //We might want to reshape this into a hashmap for easier access by the render methods
    // eg:
    // facets.reduce((map, facet) => { map[facet.param] = facet; return map}, {})
    // Then we won't have to search the array everytime we want to know what facets are available
    // or grab a particular facet AS ABOVE ^
const dummyResults = {
    results: [
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
            ]
        }
	]
}

// This represents a post-processed hash of the facets
// const dummyFacetResults = {
// 	"meta": {
// 		"totalResults": 168
// 	},
// 	"results": [],
// 	"facets": {
//         "toolType.type": {
//             "title": "Tool Types",
//             "param": "toolType.type",
//             "items": [
//                 {
//                     "key": "datasets_databases",
//                     "label": "Datasets & Databases",
//                     "count": 10,
//                     "selected": false
//                 },
//                 {
//                     "key": "lab_tools",
//                     "label": "Lab Tools",
//                     "count": 27,
//                     "selected": false
//                 },			
//             ]
//         },
//         "researchAreas": {
//             "title": "Research Areas",
//             "param": "researchAreas",
//             "items": [
//                 {
//                     "key": "cancer_prevention",
//                     "label": "Cancer Prevention",
//                     "count": 32,
//                     "selected": false
//                 },
//                 {
//                     "key": "cancer_genomics",
//                     "label": "Cancer Genomics",
//                     "count": 2,
//                     "selected": false
//                 },
//             ]
//         },
//     }
// }

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