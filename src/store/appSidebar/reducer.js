
let initialState = {
    show: false,

    onStealthMode: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_SIDEBAR':
            return Object.assign({}, state, {
                show: true
            });
        case 'HIDE_SIDEBAR':
            return Object.assign({}, state, {
                show: true
            });
        case 'SWITCH_Stealth_MODE':
            return Object.assign({}, state, {
                onStealthMode: action.mode
            });
        default:
            return state;
    }
};
