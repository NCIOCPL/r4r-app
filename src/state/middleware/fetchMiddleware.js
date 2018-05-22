import {
    timedFetch,
    handleResponse,
    handleNetworkFailure,
    constructErrorMessage,
} from '../../utilities/fetchHelpers';
import {
    setFetchingStatus,
} from '../api/actions';

const createFetchMiddleware = apiEndpoint => ({ dispatch, getState }) => next => action => {
    // This is an async call, so we want the passed action to resolve immediately (for things like the
    // the logger middleware or eventReporter to pick up on)
    next(action);

    if(action.type !== '@@api/FETCH'){
        return;
    }

    const {
        url,
        onSuccess,
        options,
        timeout,
    } = action.fetch;

    if(url){
        console.log('Resource not cached, fetching from db')
        const fetchId = Date.now();
        dispatch(setFetchingStatus(true, fetchId));
    
        const wrappedSuccess = (() => (res) => {
            if(getState().api.fetchId === fetchId){
                onSuccess(dispatch)(res);
            }
        })();
    
        timedFetch( apiEndpoint + url, timeout, options)
            .catch(handleNetworkFailure)
            .then(handleResponse)
            .then(wrappedSuccess)
            .catch(err => constructErrorMessage(err, dispatch))
    }
}

export default createFetchMiddleware;