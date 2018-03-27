import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {Route} from 'react-router-dom';
import RouterView from '@/../core/router-view';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import PageTransition from '@/components/PageTransition';
import onEnter from '@/components/onEnter';
import styles from '@/assets/stylus/app.styl';
import globalStyles from '@/assets/css/main.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class App extends Component {

    render() {

        const {
            routes, location,
            dispatch, actions, ssr,
            states: {appHeader, appSidebar, pageTransition, common}
        } = this.props;
        const boundActionCreators = bindActionCreators(actions, dispatch);

        return (
            <div className={styles.app}>
                <PageTransition location={location} pageTransition={pageTransition}>
                    <div className={[
                        styles['app-view'],
                        (appHeader.show ? styles['app-view-with-header'] : ''),
                        styles[`transition-${pageTransition.effect}`]
                    ].join(' ')}>

                        <AppHeader click={this.handleClick.bind(this)} 
                            {...appHeader} isPageSwitching={common.isPageSwitching} />
                        <AppSidebar close={this.handleSidebarClose.bind(this)} {...appSidebar}></AppSidebar>
                        <RouterView
                            routes={routes}
                            location={location}
                            ssr={ssr}
                            {...boundActionCreators} />

                    </div>
                </PageTransition>
            </div>
        );
    }

    handleClick(eventData) {
        let {eventName, data} = eventData;
        eventName = eventName.replace(/-(\w)/, (m1, m2) => {
            return m2.toUpperCase();
        });
        this[eventName] && this[eventName](data);
    }

    clickMenu() {
        this.props.dispatch(this.props.actions.showSidebar());
    }

    clickBack() {
        this.props.history.go(-1);
    }

    clickAction(data) {
        if (data.route) {
            this.props.history.push(data.route);
        }
    }

    handleSidebarClose() {
        this.props.dispatch(this.props.actions.hideSidebar());
    }
}

export default withStyles(Object.assign({}, styles, globalStyles))(onEnter(App));
