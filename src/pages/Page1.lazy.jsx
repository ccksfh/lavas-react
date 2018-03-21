import React, {Component} from 'react';
class Page1 extends Component {
    render() {
        return (
            <div>
                <p onClick={this.go.bind(this)}>page1</p>
            </div>
        );
    }

    go() {
        this.props.history.push('/page2/a');
    }
}

export default Page1;
