export const LOAD_SETTINGS = 'LOAD SETTINGS';

export const loadSettings = settingsObj => ({
    type: LOAD_SETTINGS,
    payload: settingsObj,
});