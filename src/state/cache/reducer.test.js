import reducer, { initialState } from './reducer';

describe('Cache Reducer', () => {
    it('should return the initialState', () => {
        expect(reducer(initialState, { type: '@@init'})).toEqual(initialState);
    });

    it('should handle CACHE_RESOURCES');

    it('should handle CACHE_NEW_SEARCH_RESULTS');
})