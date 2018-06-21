import { LOAD_SETTINGS } from './actions';

export const initialState = {
    baseUrl: '',
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_SETTINGS:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state;
    }
}

export default reducer;