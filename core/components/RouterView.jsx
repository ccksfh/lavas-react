/**
 * @file wrapped route
 * @author lavas
 */

import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Bundle from './Bundle';

export default ({routes, location, ...rest}) => (
    <Switch location={location}>
    {
        routes && routes.map((route, i) => {
            route.rest = rest;
            let RouterView;

            if (route.path) {
                return (
                    <Route path={route.path} key={i}
                        exact={route.exact} strict={route.strict}
                        render={props => {

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

            return (
                <Route key={i} render={props => (<route.component {...props} routes={route.children} />)} />
            );
        })
    }
    </Switch>
);
