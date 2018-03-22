import React from 'react';
import styles from './AppHeader.styl';
import IconButton from 'material-ui/IconButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
class AppHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        click: () => {}
    }

    render() {
        const {show, showMenu, showBack, showLogo, logoIcon, title, actions} = this.props;

        return (show &&
            <header className={styles['app-header-wrapper']}>
                <div className={styles['app-header-left']}>
                    {showMenu &&
                    <IconButton
                        iconClassName="material-icons"
                        className={styles['app-header-icon']}
                        onClick={this.handleClick.bind(this, 'menu')}>menu</IconButton>}
                    {showBack &&
                    <IconButton
                        iconClassName="material-icons"
                        className={styles['app-header-icon']}
                        onClick={this.handleClick.bind(this, 'back')}>arrow_back</IconButton>}
                    {showLogo &&
                    <div onClick={this.handleClick.bind(this, 'logo')}>
                        {logoIcon && logoIcon.src &&
                            <img src={logoIcon.src} alt={logoIcon.alt}
                                className={styles['app-header-icon']} />}
                    </div>}
                </div>
                <div className={styles['app-header-middle']}>
                    {title}
                </div>
                <div className={styles['app-header-right']}>
                    {actions && actions.length &&
                    actions.map((action, actionIdx) =>
                        <IconButton key={actionIdx}
                            iconClassName="material-icons"
                            className={styles['app-header-icon']}
                            onClick={this.handleClick.bind(this, 'action', { actionIdx, route: action.route })}>
                            {action.icon}
                        </IconButton>
                    )}
                </div>
            </header>
        );
    }

    /**
     * 处理按钮点击事件
     *
     * @param {string} source 点击事件源名称 menu/logo/action
     * @param {Object} data 随点击事件附带的数据对象
     */
    handleClick(source, {actionIdx, route} = {}) {
        // 页面正在切换中，不允许操作，防止滑动效果进行中切换
        if (this.props.isPageSwitching) {
            return;
        }

        let eventData = {
            eventName: `click-${source}`,
            data: {}
        };

        // 点击右侧动作按钮，事件对象中附加序号
        if (source === 'action') {
            eventData.data.actionIdx = actionIdx;
        }
        // 如果传递了路由对象，进入路由
        if (route) {
            eventData.data.route = route;
        }

        // 发送给父组件，内部处理
        this.props.click(eventData);
    }
};

export default withStyles(styles)(AppHeader);
