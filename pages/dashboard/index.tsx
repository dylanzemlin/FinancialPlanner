// pages/index.js
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import * as FinanceUtils from "../../utils/finance-utils";

import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import React from "react";
import Navbar from "../../components/nav";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import NewUser from "../../modules/dashboard/newuser";
import ConvertCase from "js-convert-case";
import Moment from "moment";

const Dashboard: NextPage = (props) => {
    const { user, error, isLoading } = useUser();
    const { response: userData, responseError, fetching } = useApi("/api/user");
    const {
        response: financeData,
        responseError: financeError,
        fetching: financeFetching,
    } = useApi("/api/user/finance/");

    if (error || responseError || financeError) {
        return <p> Error: {error + " | " + responseError} </p>;
    }

    if (user == undefined || financeData == undefined) {
        return <Container title="ENGR 1411 | Dashboard" loading={true} />;
    }

    if (userData == undefined || financeFetching) {
        return <Container title="ENGR 1411 | Dashboard" loading={true} />;
    }

    if (userData?.code == 404) {
        return <NewUser />;
    }

    const date = new Date();
    const summary = FinanceUtils.calculateMonthlyFinances(date, financeData, true);
    let data: Record<
        string,
        {
            name: string;
            value: number;
        }[]
    > = {};

    let lineData: {
        month: string;
        Expense: number;
        Income: number;
    }[] = [];
    const allSummary = FinanceUtils.calculateYearlyFinances(new Date(), financeData);
    for (let monthIdx in allSummary.monthMap) {
        const monthData = allSummary.monthMap[monthIdx];

        lineData.push({
            month: Moment(parseInt(monthIdx) + 1, 'M').format('MMM'),
            Expense: monthData.expense,
            Income: monthData.income
        });
    }

    let allData: { name: string; value: number }[] = [];
    for (let key in summary.categoryMap) {
        if (!(key in data)) {
            data[key] = [];
        }

        data[key].push({
            name: key,
            value: summary.categoryMap[key],
        });
        allData.push({
            name: ConvertCase.toSentenceCase(key),
            value: summary.categoryMap[key],
        });
    }

    const yearlySummedData: { month: string, Income: number, Expense: number }[] = [];
    let sumIncome = 0;
    let sumExpense = 0;
    for(let monthIdx in allSummary.monthMap) {
        sumIncome += allSummary.monthMap[monthIdx].income;
        sumExpense += allSummary.monthMap[monthIdx].expense;
        yearlySummedData.push({
            month: Moment(parseInt(monthIdx) + 1, 'M').format('MMM'),
            Expense: sumExpense,
            Income: sumIncome
        })
    }

    let yearlyPieData: Record<string,
    {
        name: string;
        value: number;
    }[]
    > = {};
    let yearlyAllPieData: { name: string; value: number }[] = [];
    for(let key in allSummary.categoryMap) {
        if (!(key in yearlyPieData)) {
            yearlyPieData[key] = [];
        }

        yearlyPieData[key].push({
            name: ConvertCase.toSentenceCase(key),
            value: allSummary.categoryMap[key],
        });
        yearlyAllPieData.push({
            name: ConvertCase.toSentenceCase(key),
            value: allSummary.categoryMap[key],
        });
    }

    let colorIdx = 0;
    const colors: string[] = ["#46BDDF", "#E84F64", "#52D273", "#E47255", "#E3C351"];

    return (
        <Container
            title="ENGR 1411 | Dashboard"
            className={"flex"}
            loading={isLoading || fetching}
        >
            <Navbar />

            <div style={{ overflowY: "scroll", width: "100%", display: "flex", flexDirection: "column" }}>
                <h1
                    style={{
                        borderBottom: "2px solid var(--color-bg-secondary)",
                        marginBottom: "0.2rem",
                    }}
                >
                    Welcome back, {userData.name}!
                </h1>

                <div style={{ width: "100%", marginBottom: "2rem" }}>
                    <h2>
                        Summary for {new Date().toLocaleString("default", {
                            month: "long",
                        })} ({date.getMonth() + 1}/01/{date.getFullYear()} to {date.getMonth() + 1}/{date.getDate()}/
                        {date.getFullYear()}):
                    </h2>

                    <div className="flex" style={{ gap: "3rem" }}>
                        <div className="flex" style={{ gap: "3rem" }}>
                            <div>
                                <h3> Monthly Statistics </h3>
                                <p>
                                    Gross Income: $
                                    {summary.gross.income.toLocaleString()}
                                </p>
                                <p>
                                    Gross Expenses: $
                                    {summary.gross.expense.toLocaleString()}
                                </p>
                                <p> Profit: ${summary.profit.toLocaleString()} </p>
                            </div>
                        </div>

                        <div className="flex" style={{ gap: "3rem" }}>
                            <div>
                                <h3> Yearly Statistics </h3>
                                <p>
                                    Gross Income: $
                                    {allSummary.gross.income.toLocaleString()}
                                </p>
                                <p>
                                    Gross Expenses: $
                                    {allSummary.gross.expense.toLocaleString()}
                                </p>
                                <p> Profit: ${allSummary.profit.toLocaleString()} </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ marginRight: "1rem", marginTop: "auto", marginBottom: "5rem", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        <div>
                            <h3 style={{ width: "100%", textAlign: "center" }}>
                                Monthly Expenses
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={allData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        nameKey="name"
                                        stroke="#fff"
                                        label={(data) => `$${((data.payload.value) as number).toFixed(3)}`}
                                        labelLine={true}
                                    >
                                        {[...Object.keys(data)].map((key) => {
                                            return (
                                                <Cell
                                                    key={key}
                                                    fill={`${colors[colorIdx++ % colors.length]}`}
                                                />
                                            );
                                        })}
                                    </Pie>
                                    <Tooltip
                                        formatter={(data: any) => `$${(data as number).toFixed(3)}`}
                                        contentStyle={{ background: "var(--color-bg-secondary)", fill: "#fff" }}
                                    />
                                    <Legend fill="#fff" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div>
                            <h3 style={{ width: "100%", textAlign: "center" }}>
                                Monthly Income & Expenses over { new Date().getFullYear() }
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={lineData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <CartesianGrid stroke="#eee" />

                                    <Line dot={false} type="linear" dataKey="Income" stroke="#44ff0f" />
                                    <Line dot={false} type="linear" dataKey="Expense" stroke="#d124ff" />

                                    <Tooltip
                                        formatter={(data: any) => `$${(data as number).toFixed(3)}`}
                                        contentStyle={{ background: "var(--color-bg-secondary)", fill: "#fff" }}
                                    />
                                    <Legend formatter={(data: any) => ConvertCase.toSentenceCase(data)} fill="#fff" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div style={{ marginRight: "1rem", marginTop: "auto", marginBottom: "5rem", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        <div>
                            <h3 style={{ width: "100%", textAlign: "center" }}>
                                Yearly Expenses
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={yearlyAllPieData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        nameKey="name"
                                        stroke="#fff"
                                        label={(data) => `$${((data.payload.value) as number).toFixed(3)}`}
                                        labelLine={true}
                                    >
                                        {[...Object.keys(yearlyPieData)].map((key) => {
                                            return (
                                                <Cell
                                                    key={key}
                                                    fill={`${colors[colorIdx++ % colors.length]}`}
                                                />
                                            );
                                        })}
                                    </Pie>
                                    <Tooltip
                                        formatter={(data: any) => `$${(data as number).toFixed(3)}`}
                                        contentStyle={{ background: "var(--color-bg-secondary)", fill: "#fff" }}
                                    />
                                    <Legend fill="#fff" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div>
                            <h3 style={{ width: "100%", textAlign: "center" }}>
                                Yearly Income & Expenses over { new Date().getFullYear() }
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={yearlySummedData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <CartesianGrid stroke="#eee" />

                                    <Line dot={false} type="linear" dataKey="Income" stroke="#44ff0f" />
                                    <Line dot={false} type="linear" dataKey="Expense" stroke="#d124ff" />

                                    <Tooltip
                                        formatter={(data: any) => `$${(data as number).toFixed(3)}`}
                                        contentStyle={{ background: "var(--color-bg-secondary)", fill: "#fff" }}
                                    />
                                    <Legend formatter={(data: any) => ConvertCase.toSentenceCase(data)} fill="#fff" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default withPageAuthRequired(Dashboard);
