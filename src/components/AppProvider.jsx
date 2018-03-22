
import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class AppProvider extends Component {

    static propTypes = {
        context: PropTypes.object,
    }

    static defaultProps = {
        context: {
            insertCss: () => '',
        }
    }

    static childContextTypes = {
        insertCss: PropTypes.func.isRequired,
    }

    getChildContext() {
        return this.props.context;
    }

    render() {
        return this.props.children || null;
    }
}
