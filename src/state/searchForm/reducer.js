import {
    UPDATE_SEARCH_BAR,
} from './actions';

const initialState = {
    searchBarValues: {
        home: '',
        results: '',
        resource: '',
    }
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_SEARCH_BAR:
            return {
                ...state,
                searchBarValues: {
                    ...state.searchBarValues,
                    [action.payload.page]: action.payload.value,
                }
            };
        default:
            return state;
    }
}

export default reducer;