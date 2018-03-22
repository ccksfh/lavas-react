import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {white} from 'material-ui/styles/colors';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './AppSidebar.styl';
import Sidebar from './Sidebar';

class AppSidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {show, title, user, blocks, close} = this.props;

        return (
            <Sidebar close={close} show={show}>
                <div className={styles['app-sidebar-content']}>
                    {title &&
                    <div className={styles["app-sidebar-title"]} onClick={this.closeAndGo.bind(this, '/')}>
                        <span className={styles["app-sidebar-title-left-icon"]}>
                            {title.imageLeft && <img src={title.imageLeft} alt={title.altLeft} />}
                            {title.iconLeft && <FontIcon className="material-icons" color={white}>{title.iconLeft}</FontIcon>}
                        </span>
                        <span>{title.text}</span>
                    </div>}
                    {user &&
                    <div className={styles["app-sidebar-user"]}>
                        <div className={styles["user-avatar"]}>
                            <FontIcon className={[styles["user-avatar-icon"], "material-icons"].join(' ')}
                            >face</FontIcon>
                        </div>
                        <div className={styles["user-info"]}>
                            <div className={styles["user-name"]}><FontIcon className="material-icons">person</FontIcon>{user.name}</div>
                            <div className={styles["user-location"]}><FontIcon className="material-icons">room</FontIcon>{user.location}</div>
                            <div className={styles["user-email"]}><FontIcon className="material-icons">email</FontIcon>{user.email}</div>
                        </div>
                    </div>}
                    {blocks &&
                    <div className={styles["app-sidebar-blocks"]}>
                        <ul>
                            {blocks.map((block, index) =>
                                <li key={index} className={styles["app-sidebar-block"]}>
                                    {block.sublistTitle &&
                                        <div className={styles["sub-list-title"]}>
                                            {block.sublistTitle}
                                        </div>}
                                    {block.list &&
                                        <ul>
                                            {block.list.map(item =>
                                                <li key={item.text} onClick={this.closeAndGo.bind(this, item.route)}>
                                                    {(item.icon || item.image) &&
                                                        <span className={styles["app-sidebar-block-left-icon"]}>
                                                            {item.image &&
                                                                <img src={item.image} alt={item.alt} />
                                                            }
                                                            {item.icon &&
                                                                <FontIcon className="material-icons">{item.icon}</FontIcon>
                                                            }
                                                        </span>
                                                    }
                                                    {item.text &&
                                                        <span className={styles["app-sidebar-block-text"]}>{item.text}</span>
                                                    }
                                                </li>
                                            )}
                                        </ul>
                                    }
                                </li>
                            )}
                        </ul>
                    </div>}
                </div>
            </Sidebar>
        )
    }

    closeAndGo(route, e) {
        e.stopPropagation();
    }
};

export default withStyles(styles)(AppSidebar);
