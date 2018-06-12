import reducer, { initialState } from './reducer';

describe('Error Reducer', () => {
    it('should return the initialState', () => {
        expect(reducer(initialState, { type: '@@init'})).toEqual(initialState);
    });

    it('should handle CLEAR_ERROR');

    it('should handle REGISTER_ERROR');
})