import {
    UPDATE_SEARCH_BAR,
} from './actions';

// Right now, the searchbar will be shared across all pages. It will be cleared on submit but
// if the user types and then navigates, the unsubmitted search text will be on any page with
// a search bar. Also, if a search bar is implemented on the results page, it won't reflect the
// submitted search text (since that will have been cleared out). These are questions for later
// that won't take too much refactoring.

const initialState = {
    q: '',
    // toolTypes: {
    //     type: null,
    //     subtypes: [],
    // },
    // researchAreas: [],
    // researchTypes: [],
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_SEARCH_BAR:
            return {
                ...state,
                q: action.payload
            };
        default:
            return state;
    }
}

export default reducer;