import initialState from './state';

export default (state = initialState, action) => {
    let newState = Object.assign({}, state);
    let category = action.category;

    switch (action.type) {
        case 'SET_ACTIVE_TAB':

            newState.menuTabs.map(item => {
                item.active = category === item.text;
                return item;
            });
            return newState;

        case 'ADD_CATEGORY':

            newState.otherMenuTabs.forEach((item, index) => {
                if (category === item.text) {
                    let deletedCategoryObj = newState.otherMenuTabs.splice(index, 1)[0];
                    newState.menuTabs.push(deletedCategoryObj);
                    // setLocalMenuTabsData(menuTabsLocalDataKey, state.menuTabs);
                }
            });
            // setLocalMenuTabsData(otherMenuTabsLocalDataKey, state.otherMenuTabs);
            return newState;

        case 'DEL_CATEGORY':

            newState.menuTabs.forEach((item, index) => {
                if (category === item.text) {
                    let deletedCategoryObj = newState.menuTabs.splice(index, 1)[0];
                    newState.otherMenuTabs.unshift(deletedCategoryObj);
                    // setLocalMenuTabsData(otherMenuTabsLocalDataKey, state.otherMenuTabs);
                }
            });
            // setLocalMenuTabsData(menuTabsLocalDataKey, state.menuTabs);

            return newState;

        default:
            return state;
    }
};
