import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import RouterView from '@/../core/router-view';
import AppHeader from '@/components/AppHeader';

class App extends Component {
    render() {
        const {dispatch, routes, actions, appHeader} = this.props;
        const boundActionCreators = bindActionCreators(actions, dispatch);

        return (
            <div>
                <AppHeader {...appHeader} />
                <RouterView routes={routes} {...boundActionCreators} />
            </div>
        );
    }
}

// 基于全局的 state 输出需要的 state
function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
}

export default withRouter(connect(mapStateToProps)(App));
