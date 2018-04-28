// For now we will not check the particular success code since the api only returns one type of success (200), so we
// can just use response.ok (which is 200 - 299), we also don't need to worry about empty success (204, 205)
export const handleRequest = async (response) => {
    if(response.ok){
        return response.json();
    }
    const body = response.json();
    const rejection = {
        ...response,
        body,
    }
    return Promise.reject(rejection);
}

export const handleNetworkFailure = error => {
    error.response = {
        status: 0,
        statusText: 'Error connecting to server. Please check your internet connection and try again.',
    };
    throw error;
}

export const timedFetch = (url, timeout = 4000, fetchOptions) => {
    return Promise.race([
        fetch(url, fetchOptions), 
        new Promise((_, reject) => {
            setTimeout(reject.call(null, { timeoutError: `Request timed out after ${ timeout / 1000}s.`}), timeout)
        })
    ])
}