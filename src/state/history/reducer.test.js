import reducer, { initialState } from './reducer';

describe('History Reducer', () => {
    it('should return the initialState', () => {
        expect(reducer(initialState, { type: '@@init'})).toEqual(initialState);
    });

    it('Should add a new location to history array for each @@router/LOCATION_CHANGE action', () => {
        const expectedLocation = 'First Location';
        const expectedHistory = [expectedLocation];
        const action = {
            type: '@@router/LOCATION_CHANGE',
            payload: expectedLocation
        }
        const initialState = [];
        const newState = reducer(initialState, action);
        expect(newState).toEqual(expectedHistory);
    })
})