export const REGISTER_ERROR = 'REGISTER ERROR';
export const CLEAR_ERROR = 'CLEAR ERROR';
export const PAGE_NOT_FOUND = 'PAGE NOT FOUND'

export const registerError = error => ({
    type: REGISTER_ERROR,
    payload: {
        message: error,
    }
})

export const clearError = () => ({
    type: CLEAR_ERROR,
})

export const pageNotFound = () => ({
    type: PAGE_NOT_FOUND,
})