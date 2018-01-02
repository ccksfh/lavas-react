import React, { Component } from 'react';

class Page1 extends Component {
    render() {
        return (
            <div>
                inpage1
            </div>
        );
    }

    componentDidMount() {
        console.log('page1 mount')
    }

    componentWillUnmount() {
        console.log('page1 unmount')
    }
}

export default Page1;
