// pages/index.js
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import React from "react";
import Navbar from "../../components/nav";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";

import Authenticate from "../../modules/student/authenticate";
import Information from "../../modules/student/information";

const SavingsDashboard: NextPage = (props) => {
    const {
        response: finance,
        fetching,
    } = useApi("/api/user/finance/");
    if (finance == undefined || fetching) {
        return (
            <Container title="ENGR 1411 | Savings Dashboard" loading={true} />
        );
    }

    return (
        <Container
            title="ENGR 1411 | Student Dashboard"
            className={"flex"}
            loading={fetching}
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
                    Savings Dashboard
                </h1>


            </div>
        </Container>
    );
};

export default withPageAuthRequired(SavingsDashboard);
