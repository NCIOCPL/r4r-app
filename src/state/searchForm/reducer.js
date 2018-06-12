import {
    UPDATE_SEARCH_BAR,
} from './actions';
import {
    SET_CURRENT_SEARCH_TEXT,
} from '../api/actions';

export const initialState = {
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
        case SET_CURRENT_SEARCH_TEXT:
            return {
                ...state,
                searchBarValues: {
                    ...state.searchBarValues,
                    home: '',
                    results: action.payload,
                    resource: '',
                }
            }
        default:
            return state;
    }
}

export default reducer;