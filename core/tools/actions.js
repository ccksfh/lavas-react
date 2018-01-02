'use strict';

const context = require.context('@/store', true, /^\.\/.*\.js$/);
const filenames = context.keys();

/**
 * actions
 *
 * @type {Object}
 */
let actionData = {};

for (let filename of filenames) {
    if (filename === './index.js' || ~filename.search(/[rR]educer/)) {
        continue;
    }

    let name = filename.replace(/^\.\//, '').replace(/\.js$/, '').replace(/\/?[aA]ction/, '');
    let paths = name.split('/');
    // let actions = actionData;

    while (paths.length) {
        let key = paths.shift();
        if (!key) {
            continue;
        }

        if (paths.length) {
            // !actions[key] && (actions[key] = {});
            // actions = actions[key];
            continue;
        }
        else {
            let mod = getModule(filename);
            if (typeof mod === 'function') {
                // actions[key] = mod;
                actionData[key] = mod;
            }
            else if (mod) {
                // actions[key] = Object.assign({}, ...mod);
                Object.assign(actionData, ...mod);
            }
        }
    }
}

export default actionData;

/**
 * get module by file name
 *
 * @param {string} filename filename
 * @return {*}
 */
function getModule(filename) {
    const file = context(filename);
    const module = file.default || file;

    if (typeof module !== 'function' && !module.action && !~filename.search(/[aA]ction/)) {
        return false;
    }

    if (typeof module === 'function') {
        return [{
            [module.name]: module
        }];
    }

    if (typeof module !== 'function' && module.action) {
        if (typeof module.action !== 'function') {
            throw new Error(
                '[lavas] action should be a creator function in store/' + filename.replace('./', '')
            );
        }

        return module.action;
    }

    let actions = [];

    if (Object.prototype.toString(module) === '[object Object]') {
        for (let k in module) {
            if (module.hasOwnProperty(k) && typeof module[k] === 'function') {
                actions.push({
                    [k]: module[k]
                });
            }
        }
    }

    return actions;
}
