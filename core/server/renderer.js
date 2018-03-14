'use strict';
import template from 'lodash.template';
import {join} from 'path';
import {readFile} from 'fs-extra';

const serverHtmlTmpl = join(__dirname, '../templates/server.html.tmpl');

/**
 * @param {Object} data {content, data, config, manifest, helmet}
 */
export default async (data) => {
    return template(await readFile(serverHtmlTmpl, 'utf8'))(data);
};
