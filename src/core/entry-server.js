/**
 * @file server entry
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

import createApp from './createApp';

export default function (ctx) {
    return createApp({
        userAgent: ctx.header['user-agent']
    });
}