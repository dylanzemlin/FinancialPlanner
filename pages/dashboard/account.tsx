// pages/index.js
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import React, { useState } from "react";
import Navbar from "../../components/nav";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import ResetAccount from "../../popups/dashboard/account/ResetAccount";

const AccountDashboard: NextPage = (props) => {
    return (
        <Container
            title="ENGR 1411 | Student Dashboard"
            className={"flex"}
        >
            <Navbar />

            <div className="flex column width-fill">
                <h1
                    style={{
                        borderBottom: "2px solid var(--color-bg-secondary)",
                        marginBottom: "0.2rem",
                        paddingBottom: "0.2rem"
                    }}
                >
                    Account
                </h1>

                <h2>
                    General Settings
                </h2>

                <div>

                </div>

                <h2 style={{ color: "var(--color-error)" }}>
                    Danger Zone
                </h2>

                <div>
                    <ResetAccount />
                </div>
            </div>
        </Container>
    );
};

export default withPageAuthRequired(AccountDashboard);
