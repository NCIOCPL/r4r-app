/**
 * If the API returns a 'from' that is greater than the total results we want the user to be
 * redirected to the first page of results.
 * 
 * @param {Object} meta
 * @param {number} [meta.totalResults]
 * @param {number} [meta.from]
 * @return {Object}
 */
const validateStartFrom = meta => {
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

export const validateSearchResponse = res => {
    let validRes = { ...res };
    validRes = {
        ...validRes,
        meta: validateStartFrom(validRes.meta),
    }
    console.log(validRes)
    return validRes;
}

const addFromParamIfNoneFound = req => {
    if(!req.from){
        req.from = 0;
    }
    return req;    
}

export const validateSearchRequest = req => {
    req = addFromParamIfNoneFound(req);
    return req;
}