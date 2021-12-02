// pages/index.js
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import { toast } from 'react-toastify';
import React, { useState } from "react";
import Navbar from "../../components/nav";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";

const SavingsDashboard: NextPage = (props) => {
    const {
        response: finance,
        fetching,
    } = useApi("/api/user/finance/");

    const [savingsGoal, setSavingsGoal] = useState(0);
    const [monthlyContribution, setMonthlyContribution] = useState(0);
    const [timeframe, setTimeFrame] = useState(0);

    if (finance == undefined || fetching) {
        return (
            <Container title="ENGR 1411 | Savings Dashboard" loading={true} />
        );
    }

    const calculateSavings = () => {

        if(savingsGoal == 0 && monthlyContribution == 0 && timeframe == 0) {

            // One field must be set to zero
            toast.error(`You must leave one of the fields to zero to calculate your savings goal!`);
            return;

        }

        if([savingsGoal, monthlyContribution, timeframe].filter(x => x == 0).length < 2) {

            // One field must be set to zero
            toast.error(`You must fill in two of the fields to calculate your savings goal!`);
            return;

        }

        if(savingsGoal == 0) {
             // https://github.com/Sage-A/Design-Project-1411/blob/main/Savings%20Goal#L19
             setSavingsGoal(monthlyContribution * timeframe);
        } else if (monthlyContribution == 0) {
            // https://github.com/Sage-A/Design-Project-1411/blob/main/Savings%20Goal#L23
            setMonthlyContribution(savingsGoal / timeframe);
        } else if (timeframe == 0) {
            // https://github.com/Sage-A/Design-Project-1411/blob/main/Savings%20Goal#L27
            setTimeFrame(Math.ceil(savingsGoal / monthlyContribution));
        }

    };

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

                <div className="flex column centered">
                    <h2 style={{ margin: "0.7rem 0 0 0" }}> Fill in 2/3 Fields </h2>
                    <p style={{ marginBottom: "2rem" }}> By filling in two out of the three fields, the other will be calculated </p>

                    <div className="flex column centered" style={{ gap: "2rem" }}>
                        <div className="flex" style={{ gap: "2rem" }}>
                            <div className="flex column centered">
                                <label htmlFor="savings"> Savings Goal </label>
                                <span>
                                    $
                                    <input
                                        type="number"
                                        id="savings"
                                        step="any"
                                        min="0"
                                        value={savingsGoal}
                                        onChange={(e) => setSavingsGoal(parseFloat(e.target.value))}
                                        style={{ marginTop: "0.25rem" }}
                                        placeholder="$0.00"
                                    />
                                </span>
                            </div>

                            <div className="flex column centered">
                                <label htmlFor="monthly"> Monthly Contribution </label>
                                <span>
                                    $
                                    <input
                                        type="number"
                                        id="monthly"
                                        step="any"
                                        min="0"
                                        value={monthlyContribution}
                                        onChange={(e) => setMonthlyContribution(parseFloat(e.target.value))}
                                        style={{ marginTop: "0.25rem" }}
                                        placeholder="$0.00"
                                    />
                                </span>
                            </div>

                            <div className="flex column centered">
                                <label htmlFor="timeframe"> Time Frame (In Months) </label>
                                <span>
                                    <input
                                        type="number"
                                        id="timeframe"
                                        step="any"
                                        min="0"
                                        value={timeframe}
                                        onChange={(e) => setTimeFrame(parseInt(e.target.value))}
                                        style={{ marginTop: "0.25rem" }}
                                        placeholder="$0.00"
                                    />
                                </span>
                            </div>
                        </div>

                        <div className="flex" style={{ gap: "1rem" }}>
                            <input type="submit" value="Calculate" onClick={calculateSavings} style={{ padding: "0.3rem 2rem", fontSize: "1.1rem" }} />
                            <input type="submit" value="Reset" onClick={(e) => {
                                setMonthlyContribution(0);
                                setTimeFrame(0);
                                setSavingsGoal(0);
                            }} style={{ padding: "0.3rem 2rem", fontSize: "1.1rem" }} />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default withPageAuthRequired(SavingsDashboard);
