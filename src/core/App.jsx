import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {Route} from 'react-router-dom';
import RouterView from '@/../core/router-view';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import style from '@/assets/stylus/app.styl';
import '@/assets/css/main.css';

class App extends Component {

    render() {
        let styles = style;
        if (style.constructor === Array) {
            styles = style.locals;
        }

        const {
            routes, location,
            dispatch, actions,
            appHeader, appSidebar, pageTransition
        } = this.props;
        const boundActionCreators = bindActionCreators(actions, dispatch);

        return (
            <div className={styles.app}>
                <AppHeader click={this.handleClick.bind(this)} {...appHeader} />
                <AppSidebar close={this.handleSidebarClose.bind(this)} {...appSidebar}></AppSidebar>
                <TransitionGroup>
                    <CSSTransition
                        key={location.key} 
                        timeout={{ enter: 200, exit: 200}}
                        classNames={pageTransition.effect}
                        mountOnEnter={true} unmountOnExit={true}
                        onEnter={this.handleBeforeEnter.bind(this)}
                        onEntered={this.handleAfterEnter.bind(this)}
                    >
                        <div className={[
                            styles['app-view'],
                            (appHeader.show ? styles['app-view-with-header'] : ''),
                            styles[`transition-${pageTransition.type}`]
                        ].join(' ')}>
                            <RouterView 
                                routes={routes} 
                                location={location}
                                {...boundActionCreators} />
                        </div>
                    </CSSTransition>
                </TransitionGroup>
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

export default App;
