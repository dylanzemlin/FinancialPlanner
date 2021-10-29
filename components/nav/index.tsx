import { NextPage } from 'next';
import { useState } from 'react';
import Styles from './nav.module.scss';

const Navbar: NextPage = () => {
    const [ isCollapsed, setCollapsed ] = useState(false);

    return (
        <div className={[Styles.nav, isCollapsed ? Styles.collapsed : ''].join(' ')}>
            
        </div>
    )
}
export default Navbar;