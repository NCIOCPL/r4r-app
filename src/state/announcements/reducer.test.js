import { newMessage } from './actions';
import reducer, { initialState } from './reducer';

describe('Announcements Reducer', () => {
    it('should return the initialState', () => {
        expect(reducer(initialState, { type: '@@init'})).toEqual(initialState);
    });
    
    it('should update with a given announcement message', () => {
        const message = 'The house is on fire!!';
        const newState = reducer(initialState, newMessage(message))
        expect(newState.liveMessage).toBe(message);
    })
})