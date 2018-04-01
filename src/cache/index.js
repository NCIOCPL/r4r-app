// Returning undefined ensures Redux will load from initialState if sessionStorage isn't available
export const loadStateFromSessionStorage = () => {
    try {
        const serializedState = sessionStorage.getItem('resources4researchers');
        if(serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    }
    catch(err) {
        return undefined;
    }
}

export const saveStatetoSessionStorage = state => {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem('resources4researchers', serializedState)
    }
    catch(err) {
        //TODO: Handle Errors
    }
}