import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import styles from '@/assets/stylus/index.styl';
class Index extends Component {

    render() {
        return (
            <React.Fragment>
                <Helmet titleTemplate="%s - Lavas">
                    <title>Home</title>
                    <meta name="keywords" content="lavas-react PWA" />
                    <meta name="description" content="基于 React 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题" />
                </Helmet>
                <div className={styles.content}>
                    <div>
                        <h2>LAVAS</h2>
                        <h4>[ˈlɑ:vəz]</h4>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.props.setAppHeader({
            show: true,
            title: 'Lavas',
            showMenu: true,
            showBack: false,
            showLogo: false,
            actions: [
                {
                    icon: 'search',
                    route: '/search'
                }
            ]
        });
    }
};

export default Index;