import queryString from 'query-string';
import '../polyfills/object_entries';
// All API parsing and formatting will be centralized so that future changes to the API only
// need to be handled here. The app will always expect a certain structure.

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
 * @typedef Facet
 * @type {Object}
 * @property {string} key
 * @property {string} label
 * @property {number} count
 * @property {boolean} selected
 */

/**
 * @typedef FacetGroup
 * @type {Object}
 * @property {string} param
 * @property {string} title
 * @property {Facet[]} items
 */

/**
 * 
 * 
 * @param {string} filterType 
 * @param {Resource} [resource={}]
 * @returns 
 */
export const formatFilters = (filterType, resource = {}) => {
    if(typeof resource !== 'object' || resource === null) {
        return;
    }
    //TODO: Is this still the right approach for tool/sub? investigate
    return resource[filterType].map(filter => {
        // Have to handle special case of type/subtypes for tooltypes
        // This isn't elegant, but hopefully readable
        if(filter.type) {
            filterType = 'toolTypes';
            filter = filter.type;
        }   
        if(filter.subtype) {
            filterType = 'toolSubtypes';
            filter = filter.subtype;
        }
        return {
            filterType,
            filter: filter.key,
            label: filter.label,
        }
    })
}

/**
 * The purpose of this conversion is to make future lookups cheaper by using a hashmap instead of filtering an array.
 * However we will have to convert the facets back into an array for rendering passes, so this would be a questionable tradeoff
 * if it wasn't such a small dataset.
 * @param {FacetGroup[]} rawFacets
 * @return {Object}
 */
export const formatRawResourcesFacets = rawFacets => {
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
 * Return a URI encoded string representing search text. An invalid argument will result in returning
 * null.
 * 
 * @param {string} rawText
 * @return {string|null} queryText
 */
export const composeQueryText = rawText => {
    if(rawText && typeof rawText === 'string') {
        const queryText = encodeURIComponent(rawText);
        return queryText;
    }
    return null;
}

export const composeQueryString = params => {
    if(typeof params !== 'object' || params === null) {
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


export const transformFacetFiltersIntoQueryString = facets => {
    if(typeof facets !== 'object' || facets === null) {
        return;
    }

    const queryStringParams = Object.entries(facets).reduce((acc, [facetParam, { items }]) => {
        const filters = Object.entries(items).reduce((acc, [filterKey, { selected }]) => {
            if(selected) {
                acc = [ ...acc, `${facetParam}=${filterKey}`];
            }
            return acc;
        }, [])
        return [...acc, ...filters];
    }, [])
    return queryStringParams.join('&');
}

/**
 * 
 * @param {Object} facets 
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
 * @param {number|string} key 
 * @param {Object} cache
 * @param {Object} cache.cachedSearches
 * @param {Object} cache.cachedResources
 * @return {Object}
 */
export const reconstituteSearchResultsFromCache = (key, cache) => {
    const cachedResult = cache.cachedSearches[key];
    const cachedResources = cache.cachedResources;
    const reconstitutedResults = {
        ...cachedResult,
        results: cachedResult.results.map(id => cachedResources[id]),
    }
    return reconstitutedResults;
}

/**
 * Return a grammatically appropriate sentence representing the resource DOCs
 * @param {KeyLabel[]} doCs
 * @return {string}
 */
export const renderDocsString = (doCs = []) => {
    if(!Array.isArray(doCs) || !doCs.length) {
        return '';
    }
    
    const base = 'This resource is managed by the National Cancer Institute';
    
    if(!doCs.length) {
        return base + '.';
    }
    if(doCs.length === 1) {
        return `${ base } and ${ doCs[0].label }.`;
    }
    
    const grammarfiedDocs = doCs.reduce((acc, doc, idx, arr) => {
        if(idx === arr.length - 1){
            acc = acc + ', and ' + doc.label;
            return acc;
        }
        acc = acc + ', ' + doc.label;
        return acc;
    })
    return `${ base }, ${ grammarfiedDocs }.`;
}

/**
 * 
 * 
 * @param {Object} facets 
 * @returns 
 */
export const getCurrentlySelectedFiltersFromFacets = facets => {
    if(typeof facets !== 'object' || facets === null) {
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

    if (keys.includes(e.key)) {
        stopProp && e.stopPropagation();
        prevDef && e.preventDefault();
        return fn();
    }
}

/**
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