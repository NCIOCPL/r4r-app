export const NEW_MESSAGE = "NEW MESSAGE";

export const newMessage = message => ({
    type: NEW_MESSAGE,
    payload: message,
})