/**
 * @file utils.route.js
 * @author lavas
 */

export function matchRoutes(routes, url) {
    let urls = url.split('/');
    let urlPathLen = urls.length;

    for (let route of routes) {
        let routeInfo = reform(route.path);

        if (routeInfo.len === urlPathLen && reformExtra(urls, routeInfo.indexArr) === routeInfo.path) {
            // return route.component;
            return route;
        }

        if (route.children) {
            let matched = matchRoutes(route.children, url);
            if (matched) {
                return matched;
            }
        }
    }
    return null;
};

function trim(str) {
    return str.replace(/^\s*|\s*$/g, '');
}

function reform(str) {
    let arr = trim(str).split('/');
    let indexArr = [];
    let initialLen = 0;

    if (arr[0].length) {
        arr.unshift('');
    }
    initialLen = arr.length;

    arr = arr.filter((val, i) => {
        if (/^:/.test(val)) {
            indexArr.push(i);
            return false;
        }
        return true;
    });

    return {
        len: initialLen,
        indexArr,
        path: arr.join('/')
    }
}

function reformExtra(pathChunks, indexArr) {
    return pathChunks.filter((val, i) => indexArr.indexOf(i) === -1).join('/');
}
