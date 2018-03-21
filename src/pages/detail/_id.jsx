import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom'
import styles from '@/assets/stylus/detail.styl';

export default class OnEnter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let id = this.props.match.params.id;

        return (
            <React.Fragment>
                <Helmet titleTemplate="%s - Lavas">
                    <title>Search</title>
                    <meta name="keywords" content="lavas-react PWA" />
                    <meta name="description" content="基于 React 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题" />
                </Helmet>
                <div className="detail-wrapper">
                    <article className={styles['detail-content']}>
                        <p className={styles['detail-title']}>
                            Detail {id}
                        </p>
                        <Link to={{ pathname: `/detail/${Number(id) + 1}` }}>
                            Detail {Number(id) + 1}
                        </Link>
                        <p>
                        Progressive Web Apps are user experiences that have the reach of the web, and are:
    Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
    Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
                        </p>
                    </article>
                </div>
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.props.setAppHeader({
            show: true,
            title: 'Lavas',
            showMenu: false,
            showBack: true,
            showLogo: false,
            actions: [
                {
                    icon: 'home',
                    route: '/'
                }
            ]
        });
    }
};

export function asyncData({dispatch, states, actions, url}) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 500);
    });
}
