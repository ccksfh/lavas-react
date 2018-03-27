import React, {Component} from 'react';
import ProgressBar from '@/components/ProgressBar';
import isequal from 'lodash.isequal';
import {matchRoutes} from '@/../core/utils/route';
import {
    getMiddlewares, execSeries,
    getClientContext, getServerContext, createNext
} from '@/../core/utils/middleware';
import {stringify} from 'querystring';

const onEnter = Target => {

    class OnEnter extends Component {
        static displayName = 'OnEnter';

        constructor(props) {
            super(props);
            this.state = {
                ifDone: false,
                loading: false,
                copyProps: Object.assign({}, this.props)
            };
            this.location = this.props.location;
        }

        componentWillMount() {
            let props = this.props;
            let matched = matchRoutes(props.routes, props.location.pathname);

            if (props.ssr) {
                this.handleServerMiddlewares({
                    props,
                    matchedComponents: matched
                }).catch(err => {
                    props.catchError(err);
                });
            }
            else {
                this.handleClientMiddlewares({
                    props,
                    matchedComponents: matched
                });
            }

            if (!props.ssr && typeof window.__INITIAL_STATE__ === 'undefined') {
                this.beforeEnter(props, matched[matched.length - 1]);
            } 
        }

        componentWillReceiveProps(nextProps) {
            // 只有切换路由会启用 before hook + 更新暂存
            if (nextProps.location.pathname !== this.props.location.pathname) {
                let props = nextProps;
                let matched = matchRoutes(props.routes, props.location.pathname);

                this.handleClientMiddlewares({
                    props,
                    matchedComponents: matched,
                    from: Object.assign({}, this.location)
                });

                this.location = props.location;

                props.dispatch(props.actions.setPageSwitching(true));

                this.beforeEnter(props, matched[matched.length - 1]).then(() => {
                    props.dispatch(props.actions.setPageSwitching(false));
                });
            }

            // 主要目的是暂时不让路由更新
            this.setState({
                copyProps: Object.assign({}, nextProps, {
                    location: this.location
                })
            });
        }

        render() {
            return (<React.Fragment>
                        <ProgressBar loading={this.state.loading} />
                        {this.state.ifDone
                            ? <Target {...this.props} />
                            : <Target {...this.state.copyProps} />
                        }
                    </React.Fragment>);
        }

        async beforeEnter(props, matched) {
            this.setState({
                ifDone: false,
                loading: true
            });

            if (matched) {
                await matched.asyncData({
                    dispatch: props.dispatch,
                    states: props.states,
                    actions: props.actions,
                    url: props.location.pathname
                });
            }

            this.setState({
                ifDone: true,
                loading: false,
                copyProps: Object.assign({}, this.props)
            });
        }

        async handleClientMiddlewares({props, matchedComponents, from}) {

            // all + client + components middlewares
            let middlewareNames = [
                'testAllMiddleware',
                'testClientMiddleware',
                // ...(middConf.all || []),
                // ...(middConf.client || []),
                ...matchedComponents
                    .filter(({middleware}) => !!middleware)
                    .reduce((arr, {middleware}) => arr.concat(middleware), [])
            ];

            // get all the middlewares defined by user
            const middlewares = await getMiddlewares(middlewareNames);

            let unknowMiddleware = middlewareNames.find(name => typeof middlewares[name] !== 'function');
            if (unknowMiddleware) {
                throw new Error(`Unknown middleware ${unknowMiddleware}`);
            }

            let nextCalled = false;
            const nextRedirect = opts => {
                this.setState({
                    loading: false
                });

                if (nextCalled) {
                    return;
                }
                nextCalled = true;

                if (opts.external) {
                    opts.query = stringify(opts.query);
                    opts.path = opts.path + (opts.query ? '?' + opts.query : '');

                    window.location.replace(opts.path);
                }
                else {
                    // render <Redirect /> ?
                    props.history.replace(opts.path, opts.query);
                }
            };

            // create a new context for middleware, contains store, route etc.
            let contextInMiddleware = getClientContext({
                store: {
                    dispatch: props.dispatch,
                    states: props.states,
                    actions: props.actions
                },
                to: props.location,
                from,
                next: nextRedirect
            });

            let matchedMiddlewares = middlewareNames.map(name => middlewares[name]);
            await execSeries(matchedMiddlewares, contextInMiddleware);
        }

        async handleServerMiddlewares({props, matchedComponents}) {

            return new Promise(async (resolve, reject) => {

                try {
                    let context = props.context;

                    // all + client + components middlewares
                    let middlewareNames = [
                        'testAllMiddleware',
                        'testServerMiddleware',
                        // ...(middConf.all || []),
                        // ...(middConf.server || []),
                        ...matchedComponents
                            .filter(({middleware}) => !!middleware)
                            .reduce((arr, {middleware}) => arr.concat(middleware), [])
                    ];

                    // get all the middlewares defined by user
                    const middlewares = await getMiddlewares(middlewareNames);
                    let unknowMiddleware = middlewareNames.find(name => typeof middlewares[name] !== 'function');
                    if (unknowMiddleware) {
                        reject({
                            status: 500,
                            message: `Unknown middleware ${unknowMiddleware}`
                        });
                    }

                    // add next() to context
                    context.next = createNext(context);

                    // create a new context for middleware, contains store, route etc.
                    const contextInMiddleware = getServerContext(Object.assign({}, context, {
                        store: {
                            dispatch: props.dispatch,
                            states: props.states,
                            actions: props.actions
                        },
                        route: {
                            pathname: context.url,
                            search: context.search,
                            query: context.query
                        }
                    }));

                    let matchedMiddlewares = middlewareNames.map(name => middlewares[name]);
                    await execSeries(matchedMiddlewares, contextInMiddleware);

                    // exec asyncData() defined in every matched component
                    await Promise.all(
                        matchedComponents
                            .filter(({asyncData}) => typeof asyncData === 'function')
                            .map(({asyncData}) => asyncData({
                                dispatch: props.dispatch,
                                states: props.states,
                                actions: props.actions,
                                url: props.location.pathname
                            }))
                    );

                    // mount the latest snapshot of store on context
                    context.isProd = process.env.NODE_ENV === 'production';
                    resolve();
                }
                catch (err) {
                    reject(err);
                }

            });
        }
    }

    return OnEnter;
}

export default onEnter;
