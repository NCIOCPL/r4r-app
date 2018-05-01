export const REGISTER_ERROR = 'REGISTER ERROR';
export const CLEAR_ERROR = 'CLEAR ERROR';

export const registerError = error => ({
    type: REGISTER_ERROR,
    payload: {
        message: error,
    }
})