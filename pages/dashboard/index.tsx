import { getEarliestFinanceDateForYear, getEarliestFinanceYear } from "@/utils/date-utils";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import * as FinanceUtils from "@/utils/finance-utils";
import * as Charts from "recharts";
import React, { useState } from "react";
import Navbar from "@/components/nav";
import useApi from "@/lib/useApi";
import Container from "@/modules/container";
import NewUser from "@/modules/dashboard/newuser";
import ConvertCase from "js-convert-case";
import Moment from "moment";

const Dashboard: NextPage = (props) => {
    const { response: userData, fetching } = useApi("/api/user");
    const {
        response: financeData,
        fetching: financeFetching,
    } = useApi("/api/user/finance/");

    const [month, setMonth] = useState(Moment().format("MMMM"));
    const [year, setYear] = useState(parseInt(Moment().format("YYYY")));

    if (userData == undefined || financeFetching || financeData == undefined) {
        return <Container title="ENGR 1411 | Dashboard" loading={true} />;
    }

    if (userData?.code == 404) {
        return <NewUser />;
    }

    let colorIdx = 0;
    const colors: string[] = ["#46BDDF", "#E84F64", "#52D273", "#E47255", "#E3C351"];

    // List of years available to render
    let years: number[] = [];
    for (let i = getEarliestFinanceYear(financeData); i <= new Date().getFullYear(); i++) {
        years.push(i);
    }

    // List of months available to render based on year
    let months: string[] = [];
    for (let i = getEarliestFinanceDateForYear(financeData, year).getMonth(); i <= (year != new Date().getFullYear() ? 11 : new Date().getMonth()); i++) {
        months.push(Moment(i + 1, 'M').format('MMMM'));
    }

    // Calculate the date to render data about
    const date = new Date(
        year,
        parseInt(Moment(month, 'MMMM').format('MM')) - 1,
        Moment(month, 'MMMM').daysInMonth()
    );

    const monthlyFinances = FinanceUtils.calculateMonthlyFinances(date, financeData, false);
    let monthlyMapData: Record<string, { name: string; value: number; }[]> = {};

    // Calculate the monthly pie chart data
    let monthlyData: { name: string; value: number }[] = [];
    for (let key in monthlyFinances.categoryMap) {
        if (!(key in monthlyMapData)) {
            monthlyMapData[key] = [];
        }

        monthlyMapData[key].push({
            name: key,
            value: monthlyFinances.categoryMap[key],
        });
        monthlyData.push({
            name: ConvertCase.toSentenceCase(key),
            value: monthlyFinances.categoryMap[key],
        });
    }

    // Calculate yearly line graph data
    let yearlyLineData: { month: string; Expense: number; Income: number; }[] = [];
    const yearlyFinances = FinanceUtils.calculateYearlyFinances(new Date(year, 1, 1), financeData);
    for (let monthIdx in yearlyFinances.monthMap) {
        const monthData = yearlyFinances.monthMap[monthIdx];

        yearlyLineData.push({
            month: Moment(parseInt(monthIdx) + 1, 'M').format('MMM'),
            Expense: monthData.expense,
            Income: monthData.income
        });
    }

    // Calculate yearly summed line graph data
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

    // Calculate the yearly pie chart data
    let yearlyMapData: Record<string, { name: string; value: number; }[]> = {};
    let yearlyData: { name: string; value: number }[] = [];
    for (let key in yearlyFinances.categoryMap) {
        if (!(key in yearlyMapData)) {
            yearlyMapData[key] = [];
        }

        yearlyMapData[key].push({
            name: ConvertCase.toSentenceCase(key),
            value: yearlyFinances.categoryMap[key],
        });
        yearlyData.push({
            name: ConvertCase.toSentenceCase(key),
            value: yearlyFinances.categoryMap[key],
        });
    }

    return (
        <Container
            title="ENGR 1411 | Dashboard"
            className={"flex"}
            loading={fetching}
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

                        <div className="flex" style={{ gap: "3rem" }}>
                            <div>
                                <h3> Average Statistics </h3>
                                <p>
                                    Average Income: $
                                    {(yearlyLineData
                                        .map(x => x.Income)
                                        .reduce((a, b) => a + b)
                                        / yearlyLineData.length
                                    ).toLocaleString()}
                                </p>
                                <p>
                                    Average Expenses: $
                                    {(yearlyLineData
                                        .map(x => x.Expense)
                                        .reduce((a, b) => a + b)
                                        / yearlyLineData.length
                                    ).toLocaleString()}
                                </p>
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
                            <Charts.ResponsiveContainer width="100%" height={400}>
                                <Charts.PieChart>
                                    <Charts.Pie
                                        data={monthlyData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        nameKey="name"
                                        stroke="#fff"
                                        label={(data) => `$${((data.payload.value) as number).toLocaleString()}`}
                                        labelLine={true}
                                    >
                                        {[...Object.keys(monthlyMapData)].map((key) => {
                                            return (
                                                <Charts.Cell
                                                    key={key + "-monthly"}
                                                    fill={`${colors[colorIdx++ % colors.length]}`}
                                                />
                                            );
                                        })}
                                    </Charts.Pie>
                                    <Charts.Tooltip
                                        formatter={(data: any) => `$${(data as number).toLocaleString()}`}
                                        contentStyle={{ background: "var(--color-bg-secondary)", fill: "#fff" }}
                                    />
                                    <Charts.Legend fill="#fff" />
                                </Charts.PieChart>
                            </Charts.ResponsiveContainer>
                        </div>

                        <div>
                            <h3 style={{ width: "100%", textAlign: "center" }}>
                                Monthly Income & Expenses over {year}
                            </h3>
                            <Charts.ResponsiveContainer width="100%" height={400}>
                                <Charts.LineChart data={yearlyLineData}>
                                    <Charts.XAxis dataKey="month" />
                                    <Charts.YAxis />
                                    <Charts.CartesianGrid stroke="#eee" />

                                    <Charts.Line strokeWidth={3} dot={false} type="linear" dataKey="Income" stroke="#44ff0f" />
                                    <Charts.Line strokeWidth={3} dot={false} type="linear" dataKey="Expense" stroke="#ff3f5f" />

                                    <Charts.Tooltip
                                        formatter={(data: any) => `$${(data as number).toLocaleString()}`}
                                        contentStyle={{ background: "var(--color-bg-secondary)", fill: "#fff" }}
                                    />
                                    <Charts.Legend formatter={(data: any) => ConvertCase.toSentenceCase(data)} fill="#fff" />
                                </Charts.LineChart>
                            </Charts.ResponsiveContainer>
                        </div>
                    </div>

                    <div style={{ marginRight: "1rem", marginTop: "auto", marginBottom: "5rem", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        <div>
                            <h3 style={{ width: "100%", textAlign: "center" }}>
                                Yearly Expenses
                            </h3>
                            <Charts.ResponsiveContainer width="100%" height={400}>
                                <Charts.PieChart>
                                    <Charts.Pie
                                        data={yearlyData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        nameKey="name"
                                        stroke="#fff"
                                        label={(data) => `$${((data.payload.value) as number).toLocaleString()}`}
                                        labelLine={true}
                                    >
                                        {[...Object.keys(yearlyMapData)].map((key) => {
                                            return (
                                                <Charts.Cell
                                                    key={key + "-yearly"}
                                                    fill={`${colors[colorIdx++ % colors.length]}`}
                                                />
                                            );
                                        })}
                                    </Charts.Pie>
                                    <Charts.Tooltip
                                        formatter={(data: any) => `$${(data as number).toLocaleString()}`}
                                        contentStyle={{ background: "var(--color-bg-secondary)", fill: "#fff" }}
                                    />
                                    <Charts.Legend fill="#fff" />
                                </Charts.PieChart>
                            </Charts.ResponsiveContainer>
                        </div>

                        <div>
                            <h3 style={{ width: "100%", textAlign: "center" }}>
                                Yearly Income & Expenses over {year}
                            </h3>
                            <Charts.ResponsiveContainer width="100%" height={400}>
                                <Charts.LineChart data={yearlySummedData}>
                                    <Charts.XAxis dataKey="month" />
                                    <Charts.YAxis />
                                    <Charts.CartesianGrid stroke="#eee" />

                                    <Charts.Line strokeWidth={3} dot={false} type="linear" dataKey="Income" stroke="#44ff0f" />
                                    <Charts.Line strokeWidth={3} dot={false} type="linear" dataKey="Expense" stroke="#ff3f5f" />

                                    <Charts.Tooltip
                                        formatter={(data: any) => `$${(data as number).toLocaleString()}`}
                                        contentStyle={{ background: "var(--color-bg-secondary)", fill: "#fff" }}
                                    />
                                    <Charts.Legend formatter={(data: any) => ConvertCase.toSentenceCase(data)} fill="#fff" />
                                </Charts.LineChart>
                            </Charts.ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default withPageAuthRequired(Dashboard);
