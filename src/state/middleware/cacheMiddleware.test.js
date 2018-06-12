import cacheMiddleware from './cacheMiddleware';

describe('Cache Middleware', () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn();
    const mockStore = {
        dispatch: mockDispatch,
        getState: mockGetState
    }
    const nextHandler = cacheMiddleware(mockStore);

    it('must return a function to handle next', () => {
        expect(nextHandler).toEqual(expect.any(Function));
    });

    it('must handle next', () => {
        const actionHandler = nextHandler();
        expect(actionHandler).toEqual(expect.any(Function));
    })


    describe('action handling', () => {
        
    })
})