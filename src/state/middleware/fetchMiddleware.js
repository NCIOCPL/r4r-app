import {
    timedFetch,
    handleResponse,
} from '../../utilities/fetchHelpers';
import {
    setFetchingStatus,
} from '../api/actions';
import {
    registerError,
} from '../error/actions';

const createFetchMiddleware = apiEndpoint => ({ dispatch, getState }) => next => action => {
    // This is an async call, so we want the passed action to resolve immediately (for things like the
    // the logger middleware or eventReporter to pick up on)
    next(action);

    if(action.type !== '@@api/FETCH'){
        return;
    }

    const store = getState();

    // Error Prevention: Do not allow multiple fetchs to be executed in parallel.
    if(store.api.isFetching){
        console.log('Already fetching. Aborting.');
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

        //The fetch middleware generates a unique key to allow stale 
        // requests to be ignored when they resolve. This determination 
        // is performed by the wrappedSuccess function that only executes 
        // the onSuccess method in the event that the request is still fresh.
        const fetchId = Date.now();
        dispatch(setFetchingStatus(true, fetchId));
    
        const wrappedSuccess = (() => (res) => {
            if(getState().api.fetchId === fetchId){
                onSuccess(dispatch)(res);
            }
        })();
    
        timedFetch(apiEndpoint + url, timeout, options)
            .then(handleResponse)
            .then(wrappedSuccess)
            .catch(err => { dispatch(registerError(err))})
    }
}

export default createFetchMiddleware;