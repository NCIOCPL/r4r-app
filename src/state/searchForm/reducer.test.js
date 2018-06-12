import reducer, { initialState } from './reducer';

describe('Search Form Reducer', () => {
    it('should return the initialState', () => {
        expect(reducer(initialState, { type: '@@init'})).toEqual(initialState);
    });
    
    it('should handle UPDATE_SEARCH_BAR');
    it('it should handle SET_CURRENT_SEARCH_TEXT')
})