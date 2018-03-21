
// const context = require.context('bundle-loader?lazy!@/pages', true, /^\.\/.*\.jsx?$/);
const context = require.context('@/pages', true, /^\.\/.*\.jsx?$/);
const filenames = context.keys();

let routes = new Map();

for (let filename of filenames) {
    let fullpath = filename
        .replace(/^\.\//, '')
        .replace(/\.jsx?$/, '')
        .replace(/(\/)(_)/g, (...match) => match[1] + ':')
        .toLowerCase();
    let lazy = false;

    if (~fullpath.search(/\.lazy$/)) {
        lazy = true;
        fullpath = fullpath.replace(/\.lazy$/, '');
    }

    let paths = fullpath.split('/');

    while (paths.length) {
        let key = paths.shift();
        if (!key) {
            continue;
        }

        if (paths.length) {
            continue;
        }
        else {
            let prePath = fullpath.replace(new RegExp('\/?' + key + '$'), '');
            prePath = prePath ? '/' + prePath : prePath;
            fullpath = `${prePath}/${key}`;

            let route = getRoute(fullpath, filename, lazy);

            // nested route
            let preRoute = findParent(prePath);
            if (preRoute) {
                preRoute.exact = false;
                if (preRoute.children) {
                    preRoute.children.push(route);
                    // make sure route with dynamic param not to the front
                    preRoute.children.sort((r1, r2) => {
                        let path1 = r1.path.replace(new RegExp(preRoute.path), '');
                        let path2 = r2.path.replace(new RegExp(preRoute.path), '');
                        let isR1Dynamic = /^\/:/.test(path1);
                        let isR2Dynamic = /^\/:/.test(path2);

                        if (isR1Dynamic && !isR2Dynamic) {
                            return 1;
                        }
                        if (isR2Dynamic && !isR1Dynamic) {
                            return -1;
                        }
                        return 0;
                    });
                }
                else {
                    preRoute.children = [route];
                }
                continue;
            }

            routes.set(fullpath, route);
        }
    }
}

let notMatch;
for (let route of routes) {
    // move error route to the end of the queue
    if (!route[1].path) {
        notMatch = route[1];
        routes.delete(route[0]);
    }
}

routes = Array.from(routes).map(route => route[1]);
notMatch && routes.push(notMatch);

export default routes;

/**
 * find if route is nested
 *
 * @param {string} path path
 * @return {Object}
 */
function findParent(path) {
    let paths = path.split('/');

    while (paths.length) {
        let prePath = paths.join('/');

        if (routes.has(prePath)) {
            return routes.get(prePath);
        }

        paths.pop();
    }

    return false;
}

/**
 * get route config
 *
 * @param {string} fullpath fullpath
 * @param {string} filename filename
 * @param {boolean} lazy lazyload component
 * @return {Object}
 */
function getRoute(fullpath, filename, lazy) {
    const notMatch = ~fullpath.search('error');
    const target = getModule(filename);

    return {
        path: !notMatch ? fullpath.replace(/index$/, '') : '',
        name: fullpath
                .replace(/^\//, '')
                .replace(':', '')
                .replace(/(\/)(.)/g, (...match) => match[2].toUpperCase()),
        // component: getModule(filename),
        component: target.module,
        asyncData: target.asyncData,
        exact: true,
        strict: true,
        lazy
    };
}

/**
 * get module by file name
 *
 * @param {string} filename filename
 * @return {*}
 */
function getModule(filename) {
    const file = context(filename);
    // const module = file.default || file;

    // return module;
    return {
        module: file.default || file,
        asyncData: file.asyncData || function () {}
    }
}
