import { faArrowLeft, faArrowRight, faChartLine, faCog, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import React, { useState } from 'react';
import Styles from './nav.module.scss';

const Navbar: NextPage = () => {
    const [isCollapsed, setCollapsed] = useState(true);

    return (
        <div className={[Styles.nav, isCollapsed ? Styles.collapsed : '', 'flex column'].join(' ')}>
            <a href="/dashboard" className={Styles.navitem}>
                <FontAwesomeIcon icon={faHome} className={Styles.navicon} />
                <p className={Styles.navbody}>
                    Dashboard
                </p>
            </a>

            <a href="/dashboard/finances" className={Styles.navitem}>
                <FontAwesomeIcon icon={faChartLine} className={Styles.navicon} />
                <p className={Styles.navbody}>
                    Finances
                </p>
            </a>

            <a href="/account" style={{ marginTop: "auto" }} className={Styles.navitem}>
                <FontAwesomeIcon icon={faCog} className={Styles.navicon} />
                <p className={Styles.navbody}>
                    Account
                </p>
            </a>

            <a style={{ width: "100%" }} onClick={(e) => setCollapsed(!isCollapsed)} className={Styles.navitem}>
                {!isCollapsed
                    ? <FontAwesomeIcon icon={faArrowLeft} style={{ marginLeft: "0", marginRight: "0" }} className={Styles.navicon} />
                    : <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "0", marginRight: "0" }} className={Styles.navicon} />
                }
            </a>
        </div>
    )
}
export default Navbar;