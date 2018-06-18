
// Error codes:
// "GENERAL": Timeout/Network Failure
// "RESOURCE404": Resource Not Available
export const ERROR_GENERAL = "ERROR_GENERAL";
export const ERROR_RESOURCE404 = "ERROR_RESOURCE404";

/**
 * We don't need to verify the type of success code as the API only returns 200 (no other 2-300 codes)
 * 
 * @param {Response} response 
 * @return {Object|Promise<Object>} Returns either the JSON parsed reponse body or a Promise rejection
 */
export const handleResponse = (response) => {
    if(response.ok && response.status >= 200 && response.status < 400){
        return response.json();
    }
    else if(response.status){
        return Promise.reject(ERROR_RESOURCE404)
    }

    return Promise.reject(ERROR_GENERAL);
}

/**
 * Fetches don't support timeouts natively. In order to achieve that we race our fetch against a Promise.reject that resolves after a given
 * timeout. (Promises only resolve once so even though the HTTP connection will not be ended, it's eventual response will never be handled in the case
 * of a rejection. In the case of a success, the settimout silently fires to no effect.)
 * 
 * @param {string} url 
 * @param {number} [timeout=15000] 
 * @param {Object} [fetchOptions] Equivalent to the second argument passed to Fetch()
 * @return {Promise} return a Promise.race
 */
export const timedFetch = (url, timeout = 15000, fetchOptions) => {
    return Promise.race([
        fetch(url, fetchOptions), 
        new Promise((_, reject) => {
            setTimeout(() => reject(ERROR_GENERAL), timeout)
        })
    ])
}
