
export function addCategory(category) {
    return {
        type: 'ADD_CATEGORY',
        category
    };
};

export function delCategory(category) {
    return {
        type: 'DEL_CATEGORY',
        category
    };
};

export function setActiveTab(category) {
    return {
        type: 'SET_ACTIVE_TAB',
        category
    };
};
