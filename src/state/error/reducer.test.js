import reducer, { initialState } from './reducer';

describe('Error Reducer', () => {
    it('should return the initialState', () => {
        expect(reducer(initialState, { type: '@@init'})).toEqual(initialState);
    });

    it('should handle REGISTER_ERROR', () => {
        const expected = 'ERROR CODE';
        // const initial = reducer(null, { type: '@@init'});
        const result = reducer(null, { type: 'REGISTER ERROR', payload: { message: 'ERROR CODE'}})
        expect(result).toEqual(expected);
    });

    it('should handle CLEAR_ERROR', () => {
        const expected = null;
        const result = reducer('ERROR CODE', { type: 'CLEAR ERROR' })
        expect(result).toEqual(expected);
    });
})