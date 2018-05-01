import {
    REGISTER_ERROR,
} from './actions';

const initialState = null;

const reducer = (state = initialState, action) => {
    switch(action.type){
        case REGISTER_ERROR:
            return action.payload.message;
        default: 
            return state;
    }
}

export default reducer;