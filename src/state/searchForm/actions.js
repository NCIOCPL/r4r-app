export const UPDATE_SEARCH_BAR = 'UPDATE SEARCH BAR';

export const updateSearchBar = ({
    page,
    value,
}) => ({
    type: UPDATE_SEARCH_BAR,
    payload: {
        page,
        value,
    }
})