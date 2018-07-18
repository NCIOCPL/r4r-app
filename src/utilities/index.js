import queryString from 'query-string';
import '../polyfills/object_entries';

// This file contains utility functions that reformat data, provide data
// checks for components, and handle standard DOM events.

/**
 * @typedef KeyLabel
 * @type {Object}
 * @property {string} key
 * @property {string} label
 */

/**
 * @typedef Name 
 * @type {Object}
 * @property {string} [prefix]
 * @property {string} [firstName]
 * @property {string} [middleName]
 * @property {string} [lastName]
 * @property {string} [suffix]
 */

/**
 * @typedef POC
 * @type {Object}
 * @property {string} [title]
 * @property {string} [phone]
 * @property {string} [email]
 * @property {Name} [name]
 */

/** 
 * @typedef Resource
 * @type {Object}
 * @property {string} body
 * @property {string} description
 * @property {number} id
 * @property {string} title
 * @property {string} website
 * @property {{type: string, notes: ?string}} resourceAccess
 * @property {KeyLabel[]} doCs
 * @property {KeyLabel[]} [researchAreas]
 * @property {KeyLabel[]} [researchTypes]
 * @property {KeyLabel[]} [toolTypes]
 * @property {KeyLabel[]} [toolSubtypes]
 * @property {POC[]} poCs
 */

/**
 * @typedef Filter
 * @type {Object}
 * @property {string} key
 * @property {string} label
 * @property {string} param
 * @property {string} title
 * @property {number} count
 * @property {boolean} selected
 */

/**
 * @typedef Facet
 * @type {Object}
 * @property {string} param
 * @property {string} title
 * @property {Filter[]} items
 */

 /**
 * @typedef RequestParams
 * @type {Object}
 * @property {string} [q]
 * @property {number} [size]
 * @property {number} [from]
 * @property {string[]} [toolTypes]
 * @property {string[]} [toolSubtypes]
 * @property {string[]} [researchAreas]
 * @property {string[]} [researchTypes]
 * @property {string[]} [docs]
 * @property {string[]} [include]
 * @property {string[]} [includeFacets]
 */

 /**
  * @typedef FormattedFilterForHomePage
  * @type {Object}
  * @property {string} filterType
  * @property {string} filter
  * @property {string} label
  */


/**
 * Given an object representing all valid search params, returns a stringified(URIEncoded) version.
 * If an empty q string is provided it is stripped before encoding
 * If an invalid object is provided the function returns undefined.
 * (the conversion is done by the query-string library)
 * @param {RequestParams} params
 * @return {string}
 */
export const composeQueryString = params => {
    if(typeof params !== 'object' || params === null || Array.isArray(params)) {
        return;
    }

    // We remove the qString and only add it back in if it is not empty
    // to avoid unnecessary 'q=' in query string
    const { q, ...rest } = params;
    if(q){
        rest['q'] = q;
    }
    
    const queryParams = queryString.stringify(rest);
    const composedQueryString = `${ '?' }${ queryParams }`;
    return composedQueryString;
}

/**
 * Given the current facets object returned from the most recent search and update the state
 * of a given filter before returning the new copy. (Acts in the same way a redux reducer would)
 *
 * NOTE: Remember, the facets are no longer in their original state (as provided by the API), 
 * they have already been transformed by a selector using formatRawResourcesFacets() by the time this operation is performed.
 * @param {Object} currentFacets 
 * @param {string} filterType 
 * @param {string} filter
 * @return {Object}
 */
export const updateFacetFilters = (currentFacets, filterType, filter) => {
    // Tooltypes are a special case because when we clear a selected tooltype
    // we want to also clear all currently checked toolsubtypes.
    if(filterType === 'toolTypes'){
        const { toolSubtypes, ...facets} = currentFacets;
        return {
            ...facets,
            'toolTypes': {
                ...facets['toolTypes'],
                items: {
                    ...facets['toolTypes'].items,
                    [filter]: {
                        ...facets['toolTypes'].items[filter],
                        selected: !facets['toolTypes'].items[filter].selected,
                    }
                }
            },
        }
    }
    return {
        ...currentFacets,
        [filterType]: {
            ...currentFacets[filterType],
            items: {
                ...currentFacets[filterType].items,
                [filter]: {
                    ...currentFacets[filterType].items[filter],
                    selected: !currentFacets[filterType].items[filter].selected,
                }
            }
        }
    }
}

/**
 * We want to generate a query params object from the current state of provided facets 
 * (either directly from the store or after alteration). 
 * 
 * NOTE: Remember, the facets are no longer in their original state (as provided by the API), 
 * they have already been transformed by a selector using formatRawResourcesFacets() by the time this operation is performed.
 * @param {Object} facets
 * @return {Object}
 */
export const transformFacetFiltersIntoParamsObject = facets => {
    if(typeof facets !== 'object' || facets === null) {
        return;
    }

    const queryStringParams = Object.entries(facets).reduce((acc, [facetParam, { items }]) => {
        const filters = Object.entries(items).reduce((acc, [filterKey, { selected }]) => {
            if(selected) {
                acc = [ ...acc, filterKey];
            }
            return acc;
        }, [])
        if(filters.length > 1) {
            acc[facetParam] = filters;
        }
        if(filters.length === 1) {
            acc[facetParam] = filters[0];
        }
        return acc;
    }, {})
    return queryStringParams;
}

/**
 * Cached searches are previously stripped of full resource body. They only retain the reesource ID. Here we
 * use those ID to reconstitute the original full body of the search results.
 * @param {Object} cachedResult
 * @param {Object} cachedResources
 * @return {Object}
 */
export const reconstituteSearchResultsFromCache = (cachedResult, cachedResources) => {
    const reconstitutedResults = {
        ...cachedResult,
        results: cachedResult.results.map(id => cachedResources[id]),
    }
    return reconstitutedResults;
}

/**
 * RENDER HELPER
 * The purpose of this conversion is to make future lookups cheaper by using a hashmap instead of filtering an array.
 * However we will have to convert the facets back into an array for rendering passes, so this would be a questionable tradeoff
 * if it wasn't such a small dataset.
 * @param {Facet[]} rawFacets
 * @return {Object}
 */
export const formatRawResourcesFacets = rawFacets => {
    if(typeof rawFacets !== 'object' || rawFacets === null) {
        return null;
    }

    const formattedFacets = rawFacets.reduce((acc, facetType) => {
        const facetTypeFilters = facetType.items.reduce((acc, { key, ...filter}) => {
            acc[key] = filter;
            return acc;
        }, {})

        acc[facetType.param] = {
            title: facetType.title,
            items: facetTypeFilters,
        };
        return acc;
    }, {});

    return formattedFacets;
}

/**
 * RENDER HELPER
 * Grab desired facets off the resource and reformat them into a single array for rendering on
 * resource page. 
 * (Currently returns all facet filters except toolSubtypes)
 * 
 * @param {Resource} [resource={}]
 * @return {FormattedFilterForHomePage[]} 
 */
export const formatFilters = (resource = {}) => {
    if(typeof resource !== 'object' || resource === null) {
        return;
    }

    const filterTypes = ['toolTypes', 'researchAreas', 'researchTypes'];
    const formatted = filterTypes.reduce((acc, filterType) => {
        return [
            ...acc, 
            ...resource[filterType].map(filter => {
                return {
                    filterType,
                    filter: filter.key,
                    label: filter.label,
                }
            })
        ];
    }, [])

    return formatted;
}

/**
 * RENDER HELPER
 * Return a grammatically appropriate sentence representing the resource DOCs
 * @param {KeyLabel[]} doCs
 * @return {string}
 */
export const renderDocsString = (doCs = []) => {
    if(!Array.isArray(doCs) || !doCs.length) {
        return '';
    }

    const base = 'This resource is managed by the';
        
    if(!doCs.length) {
        return 'This resource is managed by the National Cancer Institute.';
    }
    if(doCs.length === 1) {
        return `${ base } ${ doCs[0].label }.`;
    }
    
    const grammarfiedDocs = doCs.reduce((acc, doc, idx, arr) => {
        if(idx === 0) {
            acc = acc + doc.label;
            return acc;
        }

        if(idx === arr.length - 1){
            acc = acc + ', and ' + doc.label;
            return acc;
        }

        acc = acc + ', ' + doc.label;
        return acc;
    }, '')
    return `${ base } ${ grammarfiedDocs }.`;
}

/**
 * RENDER HELPER
 * Given a map of facets containing maps of filters, returns an array of only the filters
 * that are currently selected.
 * Returns an empty array when provided invalid input (this functioning is for rendering only);
 * 
 * @param {Facet[]} facets 
 * @return {Filter[]}
 */
export const getCurrentlySelectedFiltersFromFacets = facets => {
    if(typeof facets !== 'object' || facets === null || Array.isArray(facets)) {
        return [];
    }

    const selected = Object.entries(facets).reduce((acc, [param, facet]) => {
        const filters = Object.entries(facet.items).reduce((acc, [key, filter]) => {
            if(filter.selected) {
                const filterContext = {
                    ...filter,
                    key,
                    title: facet.title,
                    param,
                }
                return [...acc, filterContext];
            }
            return acc;
        }, [])
        return [...acc, ...filters];
    }, [])
    return selected;
}

/**
 * RENDER HELPER
 * Generate an array representing the currently selectable page skip numbers. 0 is
 * used to represent an ellipses and will be rendered as such. Previous and next are handled
 * externally.
 * 
 * @param {number} total 
 * @param {number} current
 * @return {number[]} pages
 */
export const formatPagerArray = (total, current) => {
    const pagesFromStart = current;
    const pagesFromEnd = total - current;
    let pages;
    if(pagesFromStart > 5){
        pages = [1, 0, current - 2, current - 1, current];
    }
    else {
        pages = Array(current).fill().map((el, idx) => idx + 1); 
    }
    if(pagesFromEnd > 5) {
        pages = [...pages, current + 1, current + 2, 0, total];
    }
    else {
        const remainingPages = Array(pagesFromEnd).fill().map((el, idx) => current + idx + 1);
        pages = [ ...pages, ...remainingPages ]; 
    }
    return pages;
}

/**
 * In order to determine if the user navigated to this page from a results page we need
 * to look as far back in the history as the last time the user was at a results page. We look up the unique key
 * of the current view and see if the previous route was a results page.
 * (NOTE: This doesn't work in the very rare event a user manually navigates to a resource by typing in a url from
 * the search results route. That could be fixed by checking the previous results route search key against the cache
 * but this seems excessive.)
 * 
 * @param {Array} history
 * @param {string} currentLocationKey
 * @return {boolean}
 */
export const hasNavigatedHereFromResultsPage = (history, currentLocationKey) => {
    const historyKeys = history.map(el => el.key);
    const currentViewIndexInHistory = historyKeys.indexOf(currentLocationKey);
    const previousViewInHistory = history[currentViewIndexInHistory - 1];
    if(!previousViewInHistory){
        return false;
    }
    const isImmediatelyFollowingResultsPage = previousViewInHistory.pathname === '/search';
    return isImmediatelyFollowingResultsPage;
}

/**
 * A higher order function to handle key events. Especially useful in cases where you want multiple keys to
 * trigger the same event. Pass in the callback you want the keypress to trigger and an array 
 * of keys (using either reserved keychar strings or the numeric keycode),
 * and get back out a wrapped version of your function to use as an eventListener callback that is
 * set to trigger only in cases where the keypress event is triggered by 
 * one of the specified keys.
 * 
 * Additional paramaters allow you to control the stopPropagation and preventDefault handling of the browser.
 * @param {Object} options
 * @param {function} [options.fn = () => {}]
 * @param {Array<Number|String>} [options.keys = []] 
 * @param {boolean} [options.stopProp = false] 
 * @param {boolean} [options.prevDef = false]
 * @return {function} A wrapped version of your function to pass to use as an eventListener callback
 */
export const keyHandler = (options = {}) => e => {
    if(typeof options !== 'object' || options === null) {
        return;
    }
    
    const {
        fn = () => {}, 
        keys = ['Enter', ' '], 
        stopProp = true, 
        prevDef = true
    } = options;

    if (keys.indexOf(e.key) !== -1) {
        stopProp && e.stopPropagation();
        prevDef && e.preventDefault();
        return fn();
    }
}