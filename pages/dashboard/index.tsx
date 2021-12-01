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
import React, { useState } from "react";
import Navbar from "../../components/nav";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import NewUser from "../../modules/dashboard/newuser";
import ConvertCase from "js-convert-case";
import Moment from "moment";
import { getEarliestFinanceDateForYear, getEarliestFinanceYear } from "../../utils/date-utils";

const Dashboard: NextPage = (props) => {
    const { user, error, isLoading } = useUser();
    const { response: userData, responseError, fetching } = useApi("/api/user");
    const {
        response: financeData,
        responseError: financeError,
        fetching: financeFetching,
    } = useApi("/api/user/finance/");

    const [month, setMonth] = useState(Moment().format("MMMM"));
    const [year, setYear] = useState(parseInt(Moment().format("YYYY")));

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

    let colorIdx = 0;
    const colors: string[] = ["#46BDDF", "#E84F64", "#52D273", "#E47255", "#E3C351"];

    let years: number[] = [];
    for (let i = getEarliestFinanceYear(financeData); i <= new Date().getFullYear(); i++) {
        years.push(i);
    }

    let months: string[] = [];
    for (let i = getEarliestFinanceDateForYear(financeData, year).getMonth(); i <= (year != new Date().getFullYear() ? 11 : new Date().getMonth()); i++) {
        months.push(Moment(i + 1, 'M').format('MMMM'));
    }

    const date = new Date(
        year,
        parseInt(Moment(month, 'MMMM').format('MM')) - 1,
        Moment(month, 'MMMM').daysInMonth()
    );

    const monthlyFinances = FinanceUtils.calculateMonthlyFinances(date, financeData, true);
    let data: Record<
        string,
        {
            name: string;
            value: number;
        }[]
    > = {};

    let yearlyLineData: {
        month: string;
        Expense: number;
        Income: number;
    }[] = [];
    const yearlyFinances = FinanceUtils.calculateYearlyFinances(new Date(year, 1, 1), financeData);
    for (let monthIdx in yearlyFinances.monthMap) {
        const monthData = yearlyFinances.monthMap[monthIdx];

        yearlyLineData.push({
            month: Moment(parseInt(monthIdx) + 1, 'M').format('MMM'),
            Expense: monthData.expense,
            Income: monthData.income
        });
    }

    let allData: { name: string; value: number }[] = [];
    for (let key in monthlyFinances.categoryMap) {
        if (!(key in data)) {
            data[key] = [];
        }

        data[key].push({
            name: key,
            value: monthlyFinances.categoryMap[key],
        });
        allData.push({
            name: ConvertCase.toSentenceCase(key),
            value: monthlyFinances.categoryMap[key],
        });
    }

    const yearlySummedData: { month: string, Income: number, Expense: number }[] = [];
    let yearlySumIncome = 0;
    let yearlySumExpense = 0;
    for (let monthIdx in yearlyFinances.monthMap) {
        yearlySumIncome += yearlyFinances.monthMap[monthIdx].income;
        yearlySumExpense += yearlyFinances.monthMap[monthIdx].expense;
        yearlySummedData.push({
            month: Moment(parseInt(monthIdx) - 1, 'M').format('MMM'),
            Expense: yearlySumExpense,
            Income: yearlySumIncome
        })
    }

    let yearlyPieData: Record<string,
        {
            name: string;
            value: number;
        }[]
    > = {};
    let yearlyAllPieData: { name: string; value: number }[] = [];
    for (let key in yearlyFinances.categoryMap) {
        if (!(key in yearlyPieData)) {
            yearlyPieData[key] = [];
        }

        yearlyPieData[key].push({
            name: ConvertCase.toSentenceCase(key),
            value: yearlyFinances.categoryMap[key],
        });
        yearlyAllPieData.push({
            name: ConvertCase.toSentenceCase(key),
            value: yearlyFinances.categoryMap[key],
        });
    }

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
                        Summary for {Moment(date).format("MMMM")} ({date.getMonth() + 1}/01/{date.getFullYear()} to {date.getMonth() + 1}/{date.getDate()}/
                        {date.getFullYear()}):
                    </h2>

                    <div className="flex" style={{ gap: "2rem", marginBottom: "2rem" }}>
                        <div className="flex column">
                            <label htmlFor="month"> Month </label>
                            <select
                                onChange={(e) => setMonth(e.target.value)}
                                style={{ marginTop: "0.25rem", width: "fit-content" }}
                                value={month}
                            >
                                {months.map((month) => {
                                    return <option value={month}> {month} </option>
                                })}
                            </select>
                        </div>
                        <div className="flex column">
                            <label htmlFor="year"> Year </label>
                            <select
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                style={{ marginTop: "0.25rem", width: "fit-content" }}
                                value={year}
                            >
                                {years.map((year) => {
                                    return <option value={year}> {year} </option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="flex" style={{ gap: "3rem" }}>
                        <div className="flex" style={{ gap: "3rem" }}>
                            <div>
                                <h3> Monthly Statistics </h3>
                                <p>
                                    Gross Income: $
                                    {monthlyFinances.gross.income.toLocaleString()}
                                </p>
                                <p>
                                    Gross Expenses: $
                                    {monthlyFinances.gross.expense.toLocaleString()}
                                </p>
                                <p> Profit: ${monthlyFinances.profit.toLocaleString()} </p>
                            </div>
                        </div>

                        <div className="flex" style={{ gap: "3rem" }}>
                            <div>
                                <h3> Yearly Statistics </h3>
                                <p>
                                    Gross Income: $
                                    {yearlyFinances.gross.income.toLocaleString()}
                                </p>
                                <p>
                                    Gross Expenses: $
                                    {yearlyFinances.gross.expense.toLocaleString()}
                                </p>
                                <p> Profit: ${yearlyFinances.profit.toLocaleString()} </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ marginRight: "1rem", marginTop: "auto", marginBottom: "5rem", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        <div>
                            <h3 style={{ width: "100%", textAlign: "center" }}>
                                {Moment(date).format('MMMM')} Expenses
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
                                Monthly Income & Expenses over {year}
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={yearlyLineData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <CartesianGrid stroke="#eee" />

                                    <Line strokeWidth={3} dot={false} type="linear" dataKey="Income" stroke="#44ff0f" />
                                    <Line strokeWidth={3} dot={false} type="linear" dataKey="Expense" stroke="#ff3f5f" />

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
                                Yearly Income & Expenses over {year}
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={yearlySummedData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <CartesianGrid stroke="#eee" />

                                    <Line strokeWidth={3} dot={false} type="linear" dataKey="Income" stroke="#44ff0f" />
                                    <Line strokeWidth={3} dot={false} type="linear" dataKey="Expense" stroke="#ff3f5f" />

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
