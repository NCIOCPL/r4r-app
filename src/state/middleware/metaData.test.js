import metaDataMiddleware from './metadata';

describe('Metadata Middleware', () => {
    const mockDispatch = jest.fn();
    const mockGetState = () => ({});
    const mockStore = {
        dispatch: mockDispatch,
        getState: mockGetState
    }
    const nextHandler = metaDataMiddleware(mockStore);

    it('must return a function to handle next', () => {
        expect(nextHandler).toEqual(expect.any(Function))
    });

    it('must handle next', () => {
        const actionHandler = nextHandler();
        expect(actionHandler).toEqual(expect.any(Function));
    })


    describe('action handling', () => {
        let next;
        let actionHandler;
        
        beforeEach(() => {
            next = jest.fn(action => action);
            actionHandler = nextHandler(next);
        })

        it('should ignore actions that are not objects', () => {
            const fn = jest.fn();
            actionHandler(fn);

            expect(next.mock.calls.length).toBe(1);
            expect(next).toBeCalledWith(fn);
            expect(next).toHaveBeenCalledTimes(1);
        })

        it('should add meta data object to any action that doesn\'t have one', () => {
            const initialAction = {};
            actionHandler(initialAction);
            const returnedAction = next.mock.calls[0][0];
            expect(returnedAction.hasOwnProperty('meta')).toBe(true);
        })
    })
})