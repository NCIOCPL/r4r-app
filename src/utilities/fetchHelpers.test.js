import * as utils from './fetchHelpers';
import configureStore from 'redux-mock-store'
import { registerError } from '../state/error/actions';
const mockStore = configureStore([]);

describe('handleResponse()', () => {
    const fn = utils.handleResponse;
    it('should reject if response is not OK');
})

// describe('handleNetworkFailure()', () => {
//     const fn = utils.handleNetworkFailure;
//     it('should throw an error', () => {
//         expect(()=> {
//             fn({})
//         }).toThrow();
//     })
//     it('should throw an error with a response property containing a status of 0');
// })

describe('timedFetch()', () => {
    const fn = utils.timedFetch;
    it('should return a Promise');
    it('should timeout after 200ms if provided an invalid url');
})

// describe('constructErrorMessage()', () => {
//     const fn = utils.constructErrorMessage;
//     let store;
//     beforeEach(()=> {
//         store = mockStore({})
//     })
//     it('should priotize timeout messages first', () => {
//         const errorMessage = {timeoutError: 'timeoutError', response: { statusText: 'statusText'}, message: 'message'};
//         fn(errorMessage, store.dispatch);
//         const actions = store.getActions();
//         const expectedResult = registerError(errorMessage.timeoutError);
//         expect(actions).toEqual([expectedResult]) 
//     })
//     it('should fallback to statusText if no timeoutError exists', () => {
//         const errorMessage = {response: { statusText: 'statusText'}, message: 'message'};
//         fn(errorMessage, store.dispatch);
//         const actions = store.getActions();
//         const expectedResult = registerError(errorMessage.response.statusText);
//         expect(actions).toEqual([expectedResult]) 
//     })
//     it('should default to message if no timeout or response found', () => {
//         const errorMessage = {pop: { statusText: 'statusText'}, message: 'message'};
//         fn(errorMessage, store.dispatch);
//         const actions = store.getActions();
//         const expectedResult = registerError(errorMessage.message);
//         expect(actions).toEqual([expectedResult]) 
//     })
// })