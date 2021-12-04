import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import { toast } from 'react-toastify';
import React, { useState } from "react";
import Navbar from "@/components/nav";
import useApi from "@/lib/useApi";
import Container from "@/modules/container";

const SavingsDashboard: NextPage = (props) => {
    const {
        response: finance, fetching,
    } = useApi("/api/user/finance/");

    // Savings
    const [savingsGoal, setSavingsGoal] = useState(0);
    const [monthlyContribution, setMonthlyContribution] = useState(0);
    const [timeframe, setTimeFrame] = useState(0);

    // Interst
    const [initialInvestment, setInitialInvestment] = useState(0);
    const [compoundFrequency, setCompoundFreqency] = useState("monthly");
    const [compoundLength, setCompoundLength] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [interestResponse, setInterestResponse] = useState("");

    if (finance == undefined || fetching) {
        return (
            <Container title="ENGR 1411 | Savings & Interest Dashboard" loading={true} />
        );
    }

    const calculateSavings = () => {
        if (savingsGoal == 0 && monthlyContribution == 0 && timeframe == 0) {
            // One field must be set to zero
            toast.error(`You must leave one of the fields to zero to calculate your savings goal!`);
            return;
        }

        if ([savingsGoal, monthlyContribution, timeframe].filter(x => x == 0).length != 1) {
            // One field must be set to zero
            toast.error(`You must fill in two of the fields to calculate your savings goal!`);
            return;
        }

        if (savingsGoal == 0) {
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

    const calculateInterst = () => {
        if (initialInvestment <= 0 || compoundLength <= 0 || interestRate <= 0) {
            // One field must be set to zero
            toast.error(`You must fill in both your initial investment, the compound length and a interest rate to calculate compound interest!`);
            return;
        }

        // https://github.com/Sage-A/Design-Project-1411/blob/main/Calculate%20Savings%20Interest
        // https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator
        let n = compoundFrequency == 'monthly' ? 12 : 1;
        let floatRate = interestRate <= 1 ? 1 : interestRate / 100;
        let amount = initialInvestment * ((1 + (floatRate / n)) * (compoundLength * n));
        setInterestResponse(`If you let your initial investment of 
            $${initialInvestment} grow for 
            ${compoundLength} at a 
            ${(floatRate * 100).toLocaleString()}% interest rate, you will end up with 
            $${amount.toLocaleString()}!
        `);
    };

    return (
        <Container
            title="ENGR 1411 | Savings & Interest Dashboard"
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
                    Savings & Interest Dashboard
                </h1>

                <h2> Savings Calculator </h2>
                <div className="flex column centered">
                    <h3 style={{ margin: "0.7rem 0 0 0" }}> Fill in 2/3 Fields </h3>
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

                <h2 style={{ marginTop: "5rem" }}> Compound Interest Calculator </h2>
                <div className="flex column centered">
                    <div className="flex column centered" style={{ gap: "2rem" }}>
                        <div className="flex" style={{ gap: "2rem" }}>
                            <div className="flex column centered">
                                <label htmlFor="principle"> Starting Amount in Savings </label>
                                <span>
                                    $
                                    <input
                                        type="number"
                                        id="principle"
                                        step="any"
                                        min="0"
                                        value={initialInvestment}
                                        onChange={(e) => setInitialInvestment(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
                                        style={{ marginTop: "0.25rem" }}
                                        placeholder="$0.00"
                                    />
                                </span>
                            </div>

                            <div className="flex column">
                                <label htmlFor="state"> Compound Frequency </label>
                                <select
                                    onChange={(e) => setCompoundFreqency(e.target.value)}
                                    style={{ marginTop: "0.25rem" }}
                                    value={compoundFrequency}
                                >
                                    <option value="monthly"> Monthly </option>
                                    <option value="yearly"> Yearly </option>
                                </select>
                            </div>

                            <div className="flex column centered">
                                <label htmlFor="interest"> Interest Rate </label>
                                <span>
                                    %
                                    <input
                                        type="interest"
                                        id="savings"
                                        step="any"
                                        min="0"
                                        max="100"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
                                        style={{ marginTop: "0.25rem" }}
                                        placeholder="$0.00"
                                    />
                                </span>
                            </div>

                            <div className="flex column centered">
                                <label htmlFor="timeframe"> Total Investment Years </label>
                                <span>
                                    <input
                                        type="number"
                                        id="timeframe"
                                        step="any"
                                        min="0"
                                        value={compoundLength}
                                        onChange={(e) => setCompoundLength(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
                                        style={{ marginTop: "0.25rem" }}
                                        placeholder="$0.00"
                                    />
                                </span>
                            </div>
                        </div>

                        <div className="flex" style={{ gap: "1rem" }}>
                            <input type="submit" value="Calculate" onClick={calculateInterst} style={{ padding: "0.3rem 2rem", fontSize: "1.1rem" }} />
                            <input type="submit" value="Reset" onClick={(e) => {
                                setCompoundFreqency("monthly");
                                setCompoundLength(0);
                                setInterestResponse("");
                                setInitialInvestment(0);
                            }} style={{ padding: "0.3rem 2rem", fontSize: "1.1rem" }} />
                        </div>

                        <p>
                            {interestResponse}
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default withPageAuthRequired(SavingsDashboard);
