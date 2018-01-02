const defaultCategory = '推荐';
const menuTabsLocalDataKey = 'menuTabsLocalDataKey';
const otherMenuTabsLocalDataKey = 'otherMenuTabsLocalDataKey';

// Get Menu tabs shown on the front
let menuTabs = `${defaultCategory}|本地|娱乐|社会|军事|女人|互联网|科技|生活|国际|国内|体育|汽车`;
menuTabs = getLocalMenuTabsData(menuTabsLocalDataKey) || handleMenuTabsOriginData(menuTabs);
let activeIndex = 0;
let localTabData = localStorage.getItem('activeTab');
if (localTabData) {
    activeIndex = parseInt(localTabData.split('|')[0], 10);
}
menuTabs[activeIndex].active = true;

// Tabs stay in the hidden list for selecting
let otherMenuTabs = '房产|财经|时尚|教育|游戏|旅游|人文|创意';
otherMenuTabs = getLocalMenuTabsData(otherMenuTabsLocalDataKey) || handleMenuTabsOriginData(otherMenuTabs);

function handleMenuTabsOriginData(menuData) {
    return menuData.split('|').map(item => {
        return {text: item};
    });
}

function getLocalMenuTabsData(menuTabsKey = menuTabsLocalDataKey) {

    try {
        let res = JSON.parse(localStorage.getItem(menuTabsKey));
        res.forEach(item => {
            delete item.active;
        });

    }
    catch (err) {

    }
}

export default {
    menuTabs,
    otherMenuTabs,
    category: 'abcd'
};
