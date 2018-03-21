import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {Route} from 'react-router-dom';
import RouterView from '@/../core/router-view';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import PageTransition from '@/components/PageTransition';
import onEnter from '@/components/onEnter';
import styles from '@/assets/stylus/app.styl';
import '@/assets/css/main.css';

class App extends Component {

    render() {

        const {
            routes, location,
            dispatch, actions,
            states: {appHeader, appSidebar, pageTransition}
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

                        <AppHeader click={this.handleClick.bind(this)} {...appHeader} />
                        <AppSidebar close={this.handleSidebarClose.bind(this)} {...appSidebar}></AppSidebar>
                        <RouterView
                            routes={routes}
                            location={location}
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

    handleBeforeEnter() {

    }

    handleAfterEnter() {

    }

}

// function beforeEnter(props) {
//     return new Promise((resolve, reject) => {
//         setTimeout(resolve, 1000);
//     });
// }

// export default onEnter(beforeEnter)(App);
export default onEnter(App);
