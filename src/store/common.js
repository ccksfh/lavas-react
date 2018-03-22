
const initialState = {
    /**
     * 多个页面是否处于切换中
     *
     * @type {boolean}
     */
    isPageSwitching: false
};

export let actions = {
    setPageSwitching: status => ({
        type: 'SET_PAGE_SWITCHING',
        status
    })
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_PAGE_SWITCHING':
            return Object.assign({}, state, {
                isPageSwitching: action.status
            });
        default:
            return state;
    }
}
