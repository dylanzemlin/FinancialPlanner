// pages/index.js
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import React, { useState } from "react";
import Navbar from "../../components/nav";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import ResetAccount from "../../popups/dashboard/account/ResetAccount";
import SaveAccountSettings from "../../popups/dashboard/account/SaveAccount";

const AccountDashboard: NextPage = (props) => {

    const { response, fetching } = useApi("/api/user");

    const [name, setName] = useState(response?.name ?? '');
    const [age, setAge] = useState(response?.age ?? 18);

    let originalName = "";
    let originalAge = 18;

    if (response == undefined || fetching == undefined) {
        return <Container title="ENGR 1411 | Dashboard" loading={true} />;
    }

    if (name == "") {
        setName(response?.name);
        setAge(response?.age);

        originalName = response?.name;
        originalAge = response?.age;
    }

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

                <div className="flex" style={{ gap: "2rem" }}>
                    <div className="flex column">
                        <label htmlFor="firstName"> Full Name </label>
                        <input
                            type="text"
                            id="firstName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ marginTop: "0.25rem" }}
                            placeholder="John"
                        />
                    </div>

                    <div className="flex column">
                        <label htmlFor="age"> Age </label>
                        <input
                            type="number"
                            id="age"
                            step="any"
                            min="0"
                            value={age}
                            onChange={(e) => setAge(parseInt(e.target.value))}
                            style={{ marginTop: "0.25rem" }}
                            placeholder="$0.00"
                        />
                    </div>
                </div>

                <div style={{ marginTop: "0.3rem" }}>
                    <SaveAccountSettings editedFields={{ "Full Name": { from: "Dylan Zemlin", to: "John Doe" } }} />
                </div>

                <h2 style={{ color: "var(--color-error)", marginTop: "3rem" }}>
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
