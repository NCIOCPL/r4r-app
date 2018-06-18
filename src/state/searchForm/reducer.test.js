import reducer, { initialState } from './reducer';
import { UPDATE_SEARCH_BAR } from './actions';
import {
    SET_CURRENT_SEARCH_TEXT,
} from '../api/actions';

describe('Search Form Reducer', () => {
    let state;

    beforeEach(() => {
        state = reducer(initialState, '@@init');
    })
    it('should return the initialState', () => {
        expect(state).toEqual(initialState);
    });
    
    it('should handle UPDATE_SEARCH_BAR', () => {
        const payload = { page: 'home', value: 'TEST'};
        const updated = reducer(state, { type: UPDATE_SEARCH_BAR, payload});
        expect(updated.searchBarValues.home).toBe('TEST');
    });
    it('it should handle SET_CURRENT_SEARCH_TEXT', () => {
        const payload = 'TEST';
        const expected = {
            searchBarValues: {
                home: '',
                results: 'TEST',
                resource: ''
            }
        };
        const result = reducer(initialState, { type: SET_CURRENT_SEARCH_TEXT, payload })
        expect(result).toEqual(expected);
    })
})