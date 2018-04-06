import {
    NEW_MESSAGE
} from './actions';

const initialState = {
    liveMessage: '',
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case NEW_MESSAGE:
            return {
                ...state,
                liveMessage: action.payload,
            }
        default:
            return state;
    }
}

export default reducer;