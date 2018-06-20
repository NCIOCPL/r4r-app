import {
    loadStateFromSessionStorage,
    saveStatetoSessionStorage,
} from './index'


describe('sessionStorage Caching', () => {
    const data = { test: 'poop'};
    
    beforeEach(() => {
        sessionStorage.clear();
        saveStatetoSessionStorage({state: data, appId: 'app'});
    })
    it('stores items correctly', () => {
        expect(sessionStorage.getState()).toEqual({ app: JSON.stringify(data) });
    })
    it('returns undefined when a value is not cached to session storage', () => {
        expect(loadStateFromSessionStorage('nonexistentkey')).toBe(undefined);
    })
    it('retrieves stored items correctly', () => {
        expect(loadStateFromSessionStorage('app')).toEqual(data);
    })
})