import queryString from 'query-string';
import '../polyfills/object_entries';
// All API parsing and formatting will be centralized so that future changes to the API only
// need to be handled here. The app will always expect a certain structure.

export const formatFilters = (filterType, resource = {}) => {
    return resource[filterType].map(filter => {
        // Have to handle special case of type/subtypes for tooltypes
        // This isn't elegant, but hopefully readable
        if(filter.type) {
            filterType = 'toolTypes.type';
            filter = filter.type;
        }
        if(filter.subtype) {
            filterType = 'toolTypes.subtype';
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
// This is a debatable tradeoff and could be rolled back with a few hours of refactoring.
export const formatRawResourcesFacets = rawFacets => {
    const formattedFacets = rawFacets.reduce((acc, facetType) => {
        const facetTypeFilters = facetType.items.reduce((acc, filter) => {
            const {
                key,
                label,
                count,
                selected,
            } = filter;

            acc[key] = {
                label,
                // We want to process the JSON back into the correct primitives before passing them to the store
                count: ~~count, // This is one of many ways to parseInt. This way will coerce bad values into 0 instead of NaN.
                selected: (typeof !!selected === 'boolean') ? !!selected : null
            };
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

//TODO: Possibly add operator overloading to handle simple strings
export const composeQueryString = params => {
    if(!params) {
        return;
    }
    
    const queryParams = queryString.stringify(params);
    const composedQueryString = `${ '?' }${ queryParams }`;
    return composedQueryString;
}

export const transformFacetFiltersIntoQueryString = facets => {
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
export const keyHandler = options => e => {
    const {fn = () => {}, keys = ['Enter', ' '], stopProp = true, prevDef = true} = options;
    if (keys.includes(e.key)) {
        stopProp && e.stopPropagation();
        prevDef && e.preventDefault();
        return fn();
    }
}