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
                <p onClick={this.click.bind(this)} style={{
                    fontSize: '16px',
                    lineHeight: '30px',
                    marginTop: '30px'
                }}>nested-page outer framework</p>
                <RouterView routes={this.props.routes} />
            </div>
        );
    }

    componentDidMount() {
        this.props.setAppHeader({show: true, showBack: true, showMenu: false});
    }

    click() {
        this.props.history.push('/');
    }
}

export default Page2;
