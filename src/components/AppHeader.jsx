import React from 'react';
import './AppHeader.css';

export default class AppHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const show = this.props.show;
        let headerContent;

        if (show) {
            headerContent = <div className="app-header-middle">lavas</div>;
        }

        return (
            <header className="app-header-wrapper">{headerContent}</header>
        );
    }
};
