import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Bundle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mod: null
        };
    }

    componentWillMount() {
        this.load(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps);
        }
    }

    load(props) {
        // reset
        this.setState({
            mod: null
        });
        // page.load is actually an async loading operation
        // use this.setState to invoke (re)rendering with module that newlly loaded
        // we still need to customize "load" func
        props.load((mod) => {
            this.setState({
                // handle both es imports and cjs
                mod: mod.default ? mod.default : mod
            });
        });
    }

    render() {
        // if state mode not undefined,The container will render children
        return this.state.mod ? this.props.children(this.state.mod) : null;
    }
}

Bundle.propTypes = {
    load: PropTypes.func,
    children: PropTypes.func
};

export default Bundle;
