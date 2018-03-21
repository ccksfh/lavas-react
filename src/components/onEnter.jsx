import React, {Component} from 'react';
import ProgressBar from '@/components/ProgressBar';
import isequal from 'lodash.isequal';
import {matchRoutes} from '@/../core/utils/route';

// const onEnter = (
//     beforeEnter = function () {},
// ) => Target => {
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
        }

        componentWillMount() {
            this.doBeforeEnter(this.props);
        }

        componentWillUpdate(nextProps, nextState) {
            // 只有切换路由会启用 before hook + 更新暂存
            if (nextProps.location.pathname !== this.props.location.pathname) {
                this.doBeforeEnter(nextProps);
            }
            else if (!isequal(nextProps, this.props)) {
                this.setState({
                    copyProps: Object.assign({}, nextProps)
                });
            }
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

        async doBeforeEnter(props) {
            this.setState({
                ifDone: false,
                loading: true
            });

            // await beforeEnter(this.props);
            let matched = matchRoutes(props.routes, props.location.pathname);
            await matched.asyncData();

            this.setState({
                ifDone: true,
                loading: false,
                copyProps: Object.assign({}, this.props)
            });
        }
    }

    return OnEnter;
}

export default onEnter;
