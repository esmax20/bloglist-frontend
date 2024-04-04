const notificationReducer = (state = null, action) => {
    if (action.type === 'NOTIF') {
        return action.payload
    }
    return state
}

export default notificationReducer