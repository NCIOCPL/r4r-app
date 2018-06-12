import {
    REGISTER_ERROR,
    CLEAR_ERROR,
} from './actions';

export const initialState = null;

const reducer = (state = initialState, action) => {
    switch(action.type){
        case CLEAR_ERROR:
            return initialState;
        case REGISTER_ERROR:
            return action.payload.message;
        default: 
            return state;
    }
}

export default reducer;