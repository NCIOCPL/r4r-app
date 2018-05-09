import configureStore from 'redux-mock-store';
import {
    loadFacets,
    fetchResource,
    loadResource,
} from './actions';

const middleware = [];
const mockStore = configureStore(middleware);

describe('loadFacets thunk', () => {
    it('should do nothing if facets are already cached', () => {
        const initialState = {
            api: {
                referenceFacets: {}
            }
        }
        const store = mockStore(initialState);
        const expectedResult = [];
        loadFacets()(store.dispatch, store.getState)
        const actions = store.getActions();
        expect(actions).toEqual(expectedResult);
    });
})

describe('fetchResource thunk', () => {
    it('should load from cache if resource is already cached', () => {
        const mockResource = { id: 1, title: 'Mock Resource'}
        const initialState = {
            cache: {
                cachedResources: {
                    1: mockResource,
                }
            }
        }
        const store = mockStore(initialState);
        const expectedResult = [loadResource(mockResource)];
        fetchResource(1)(store.dispatch, store.getState)
        const actions = store.getActions();
        expect(actions).toEqual(expectedResult);        
    })
})