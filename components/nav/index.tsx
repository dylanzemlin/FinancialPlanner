import {
    faArrowLeft,
    faArrowRight,
    faBars,
    faChartLine,
    faCog,
    faHandPaper,
    faHome,
    faMoneyBill,
    faMoneyCheck,
    faMoon,
    faSchool,
    faSignOutAlt,
    faSun,
    faUniversity,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import useWindowDimensions from "../../lib/useWindowDimensions";
import Styles from "./nav.module.scss";

const Navbar: NextPage = () => {
    const [theme, setTheme] = useState("dark");
    const { height, width } = useWindowDimensions();
    const [isCollapsed, setCollapsed] = useState(true);

    useEffect(() => {
        let theme = localStorage.getItem("1411-theme") ?? "dark";
        setTheme(theme);
    });

    const changeTheme = (themeName: string) => {
        localStorage.setItem("1411-theme", themeName);
        document.body.dataset.theme = themeName;
        document.body.dataset.changing = "true";

        setTimeout(() => {
            document.body.dataset.changing = "false";
        }, 400);

        setTheme(themeName);
    };

    return (
        <div
            className={[
                Styles.nav,
                isCollapsed ? Styles.collapsed : "",
                width <= 550 ? Styles.mobile : "",
                "flex column",
            ].join(" ")}
        >
            {width <= 550 && <FontAwesomeIcon icon={faBars} onClick={(e) => setCollapsed(!isCollapsed)} className={Styles.navburger} />}

            <a href="/dashboard" className={Styles.navitem}>
                <FontAwesomeIcon icon={faHome} className={Styles.navicon} />
                <p className={Styles.navbody}>Dashboard</p>
            </a>

            <a href="/dashboard/savings" className={Styles.navitem}>
                <FontAwesomeIcon
                    icon={faMoneyBill}
                    className={Styles.navicon}
                />
                <p className={Styles.navbody}>Savings</p>
            </a>

            <a href="/dashboard/finances" className={Styles.navitem}>
                <FontAwesomeIcon
                    icon={faMoneyCheck}
                    className={Styles.navicon}
                />
                <p className={Styles.navbody}>Finances</p>
            </a>

            <a href="/dashboard/student" className={Styles.navitem}>
                <FontAwesomeIcon
                    icon={faUniversity}
                    className={Styles.navicon}
                />
                <p className={Styles.navbody}>Student</p>
            </a>

            <a
                href="/account"
                style={{ marginTop: "auto" }}
                className={Styles.navitem}
            >
                <FontAwesomeIcon icon={faCog} className={Styles.navicon} />
                <p className={Styles.navbody}>Account</p>
            </a>

            <a
                style={{ width: "100%" }}
                onClick={(e) =>
                    changeTheme(theme == "light" ? "dark" : "light")
                }
                className={Styles.navitem}
            >
                {theme == "light" ? (
                    <FontAwesomeIcon
                        icon={faMoon}
                        style={{ marginLeft: "0", marginRight: "0" }}
                        className={Styles.navicon}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faSun}
                        style={{ marginLeft: "0", marginRight: "0" }}
                        className={Styles.navicon}
                    />
                )}
            </a>

            <a href="/api/auth/logout" className={Styles.navitem}>
                <FontAwesomeIcon 
                    icon={faSignOutAlt}
                    className={Styles.navicon}
                />
                <p className={Styles.navbody}>Logout</p>
            </a>

            {/* {width >= 750 &&
                <a
                    style={{ width: "100%" }}
                    onClick={(e) => setCollapsed(!isCollapsed)}
                    className={Styles.navitem}
                >
                    {!isCollapsed ? (
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{ marginLeft: "0", marginRight: "0" }}
                            className={Styles.navicon}
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            style={{ marginLeft: "0", marginRight: "0" }}
                            className={Styles.navicon}
                        />
                    )}
                </a>
            } */}
        </div>
    );
};
export default Navbar;
