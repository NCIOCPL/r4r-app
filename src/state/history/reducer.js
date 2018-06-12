// This reducer is simply a patch on the react-router-redux to allow us to save a
// record of location changes

export const initialState = [];

const reducer = (state = initialState, action) => {
    switch(action.type){
        case '@@router/LOCATION_CHANGE':
            return [...state, action.payload];
        default:
            return state;
    }
}

export default reducer;