import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import Styles from "./nav.module.scss";

const Navbar: NextPage = () => {
    const [theme, setTheme] = useState("dark");

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
                "flex column",
            ].join(" ")}
        >
            <a href="/dashboard" className={Styles.navitem}>
                <FontAwesomeIcon icon={Icons.faHome} className={Styles.navicon} />
            </a>

            <a href="/dashboard/finances" className={Styles.navitem}>
                <FontAwesomeIcon
                    icon={Icons.faMoneyCheck}
                    className={Styles.navicon}
                />
            </a>

            <a href="/dashboard/savings" className={Styles.navitem}>
                <FontAwesomeIcon
                    icon={Icons.faMoneyBill}
                    className={Styles.navicon}
                />
            </a>

            {/* <a href="/dashboard/student" className={Styles.navitem}>
                <FontAwesomeIcon
                    icon={Icons.faUniversity}
                    className={Styles.navicon}
                />
            </a> */}

            {/* <a
                href="/dashboard/account"
                style={{ marginTop: "auto" }}
                className={Styles.navitem}
            >
                <FontAwesomeIcon icon={Icons.faCog} className={Styles.navicon} />
            </a> */}

            {/* <a
                style={{ width: "100%" }}
                onClick={(e) =>
                    changeTheme(theme == "light" ? "dark" : "light")
                }
                className={Styles.navitem}
            >
                {theme == "light" ? (
                    <FontAwesomeIcon
                        icon={Icons.faMoon}
                        style={{ marginLeft: "0", marginRight: "0" }}
                        className={Styles.navicon}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={Icons.faSun}
                        style={{ marginLeft: "0", marginRight: "0" }}
                        className={Styles.navicon}
                    />
                )}
            </a> */}

            <a href="/api/auth/logout" className={Styles.navitem}>
                <FontAwesomeIcon
                    icon={Icons.faSignOutAlt}
                    className={Styles.navicon}
                />
            </a>
        </div>
    );
};
export default Navbar;
