/**
 * @file wrapped route
 * @author lavas
 */

import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Bundle from './Bundle';

function RouteWithSubRoutes(route) {
    let routerView;

    if (route.path) {
        routerView = (
            <Route path={route.path} exact={route.exact} strict={route.strict} render={props => {

                if (route.lazy) {
                    return (
                        <Bundle load={route.component}>
                            {(Container) => <Container {...props} {...route.rest} routes={route.children} />}
                        </Bundle>
                    );
                }
                
                return <route.component {...props} {...route.rest} routes={route.children} />;
            }
            } />
        );
    }
    else {
        routerView = (
            <Route render={props => (
                <route.component {...props} routes={route.children} />
            )} />
        );
    }
    return (
        <React.Fragment>{routerView}</React.Fragment>
    );
}

export default ({routes, ...rest}) => (
    <Switch>
    {
        routes.map((route, i) => {
            route.rest = rest;
            return (
                <RouteWithSubRoutes key={i} {...route} />
            );
        })
    }
    </Switch>
);
