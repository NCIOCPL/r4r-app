import queryString from 'query-string';
import { composeQueryString } from './index';

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
 * @typedef Metadata
 * @type {Object}
 * @property {number} totalResults
 * @property {number} [from]
 * @property {string} originalQuery
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
 * @typedef SearchResultsBody
 * @type {Object}
 * @property {Facet[]} facets
 * @property {Resource[]} results
 * @property {Metadata} meta
 */

/**
 * If the API returns a 'from' that is greater than the total results we want the user to be
 * redirected to the first page of results.
 * 
 * @param {Metadata} meta
 * @return {Metadata}
 */
export const validateStartFrom = meta => {
    if(!isNaN(meta.from) && !isNaN(meta.totalResults)){
        if(meta.from > meta.totalResults){
            meta = {
                ...meta,
                from: 0,
            }
        }
    }
    return meta;
}

/**
 * 
 * @param {SearchResultsBody} res Response body of successful search request
 * @return {SearchResultsBody}
 */
export const validateSearchResponse = res => {
    let validRes = { ...res };
    validRes = {
        ...validRes,
        meta: validateStartFrom(validRes.meta),
    }
    return validRes;
}

/**
 * 
 * @param {RequestParams} req Search request params object
 * @param {number} [req.from]
 * @return {RequestParams}
 */
export const addFromParamIfNoneFound = req => {
    if(!req.from){
        req.from = 0;
    }
    return req;    
}

/**
 * 
 * @param {RequestParams} req Search request params object
 * @return {RequestParams}
 */
export const validateSearchRequest = req => {
    req = addFromParamIfNoneFound(req);
    return req;
}

/**
 * Converts a querystring to object format to run through extant validators.
 * Reconverts the result to return in original string format.
 * 
 * @param {string} query
 * @return {string}
 */
export const validateQueryStringSearchRequest = query => {
    const requestAsParamsObject = queryString.parse(query);
    const validatedParams = validateSearchRequest(requestAsParamsObject);
    const restringifiedRequest = composeQueryString(validatedParams);
    return restringifiedRequest;
}