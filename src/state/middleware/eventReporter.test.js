import createEventReporterMiddleware from './eventReporter';

describe('EventReporter Middleware', () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn();
    const mockStore = {
        dispatch: mockDispatch,
        getState: mockGetState
    }
    let mockEventReporter;
    let middleware;
    let nextHandler;
    let next;
    let actionHandler;

    beforeEach(() => {
        mockEventReporter = jest.fn();
        middleware = createEventReporterMiddleware(mockEventReporter);
        nextHandler = middleware(mockStore);
        next = jest.fn(action => action);
        actionHandler = nextHandler(next);
    })

    it('must return a function to handle next', () => {
        expect(nextHandler).toEqual(expect.any(Function));
    });

    it('must handle next', () => {
        expect(actionHandler).toEqual(expect.any(Function));
    })

    describe('action handling', () => {

        it('should ignore actions that are functions', () => {
            const mockThunk = jest.fn();
            actionHandler(mockThunk);
            expect(mockEventReporter).toHaveBeenCalledTimes(0)
        })
        it('should pass the eventReporter middleware actions', () => {
            const mockAction = { type: 'Test'}
            actionHandler(mockAction);
            expect(mockEventReporter).toHaveBeenCalledTimes(1);
            expect(mockEventReporter.mock.calls[0][0]).toBe(mockAction);
        })
        it('should still pass the action forward when no eventReporter exists', () => {
            mockEventReporter = null;
            middleware = createEventReporterMiddleware(mockEventReporter);
            nextHandler = middleware(mockStore);
            next = jest.fn(action => action);
            actionHandler = nextHandler(next);
            const mockAction = { type: 'Test'}
            actionHandler(mockAction);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next.mock.calls[0][0]).toBe(mockAction);
        })
    })
})