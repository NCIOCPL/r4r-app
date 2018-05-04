import queryString from 'query-string';
import '../polyfills/object_entries';
// All API parsing and formatting will be centralized so that future changes to the API only
// need to be handled here. The app will always expect a certain structure.

export const formatFilters = (filterType, resource = {}) => {
    if(typeof resource !== 'object' || resource === null) {
        return;
    }

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

// Despite causing issues with iterating for rendering purposes (which we solve for now
// with Object.entries) converting the data into a hashmap makes lookups a lot quicker and simpler.
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

export const composeQueryText = rawText => {
    if(rawText && typeof rawText === 'string') {
        const queryText = encodeURIComponent(rawText)
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
                acc = [ ...acc, `${facetParam}=${filterKey}`]
            }
            return acc;
        }, [])
        return [...acc, ...filters];
    }, [])
    return queryStringParams.join('&');
}

export const transformFacetFiltersIntoParamsObject = facets => {
    if(typeof facets !== 'object' || facets === null) {
        return;
    }

    const queryStringParams = Object.entries(facets).reduce((acc, [facetParam, { items }]) => {
        const filters = Object.entries(items).reduce((acc, [filterKey, { selected }]) => {
            if(selected) {
                acc = [ ...acc, filterKey]
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

export const reconstituteSearchResultsFromCache = (key, cache) => {
    const cachedResult = cache.cachedSearches[key];
    const cachedResources = cache.cachedResources;
    const reconstitutedResults = {
        ...cachedResult,
        results: cachedResult.results.map(id => cachedResources[id]),
    }
    return reconstitutedResults;
}

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
        return acc
    })
    return `${ base }, ${ grammarfiedDocs }.`;
}

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
                return [...acc, filterContext]
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
 * @param {object} options
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