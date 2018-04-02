import queryString from 'query-string';

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
                count,
                selected
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

// TODO: Deprecating in favor of query-string library
// export const composeQueryParams = params => {
//     if(params) {
//         const paramStrings = Object.entries(params).map(([param, value]) =>{
//             return `${ param }=${ encodeURIComponent(value) }`
//         })
//         const composedParamStrings = paramStrings.join('&');
//         return composedParamStrings;
//     }
//     return null;
// }

//TODO: Possibly add operator overloading to handle simple strings
export const composeQueryString = params => {
    if(!params) {
        return;
    }
    // TODO: DEPRECATED
    // const queryParams = composeQueryParams(params);
    
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
        return [...acc, ...filters]
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