import React, {Component} from 'react';
// import RouterView from '@/../core/router-view';
import RouterView from '../../core/router-view';

class Page2 extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                inpage2 outer
                <RouterView routes={this.props.routes} />
            </div>
        );
    }

    componentDidMount() {
        console.log('page2 mount')

        const {setAppHeader} = this.props;
        setAppHeader({show: false});
    }
}

export default Page2;
