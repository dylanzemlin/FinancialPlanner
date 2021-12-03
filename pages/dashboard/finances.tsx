// pages/index.js
import { getEarliestFinanceDateForYear, getEarliestFinanceYear } from "../../utils/date-utils";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import React, { useState } from "react";
import Navbar from "../../components/nav";
import Moment from "moment";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import CreateExpense from "../../popups/dashboard/finances/CreateExpense";
import CreateIncome from "../../popups/dashboard/finances/CreateIncome";
import DeleteFinance from "../../popups/dashboard/finances/DeleteFinance";
import EditExpense from "../../popups/dashboard/finances/EditExpense";
import EditIncome from "../../popups/dashboard/finances/EditIncome";
import ConvertCase from "js-convert-case";
import { calculateOccurancesInMonth } from "../../utils/finance-utils";

const FinanceDashboard: NextPage = (props) => {
    let {
        response: finance,
        fetching,
    } = useApi("/api/user/finance/");

    const [month, setMonth] = useState("all");
    const [year, setYear] = useState(parseInt(Moment().format("YYYY")));

    if (finance == undefined || fetching) {
        return (
            <Container title="ENGR 1411 | Finance Dashboard" loading={true} />
        );
    }

    let years: number[] = [];
    for (let i = getEarliestFinanceYear(finance); i <= new Date().getFullYear(); i++) {
        years.push(i);
    }

    let months: string[] = [];
    for (let i = getEarliestFinanceDateForYear(finance, year).getMonth(); i <= (year != new Date().getFullYear() ? 11 : new Date().getMonth()); i++) {
        months.push(Moment(i + 1, 'M').format('MMMM'));
    }

    const date = new Date(
        year,
        month == "all" ? 1 : parseInt(Moment(month, 'MMMM').format('MM')) - 1,
        new Date().getDate()
    );

    return (
        <Container
            title="ENGR 1411 | Finance Dashboard"
            className={"flex"}
            loading={fetching}
        >
            <Navbar />

            <div
                className="flex column width-fill"
                style={{ paddingRight: "1rem", overflowY: "scroll" }}
            >
                <h1
                    style={{
                        borderBottom: "2px solid var(--color-bg-secondary)",
                        marginBottom: "0.2rem",
                    }}
                >
                    Finances
                </h1>

                <div className="flex" style={{ gap: "2rem", marginTop: "0.75rem" }}>
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

                            <option value="all"> All </option>
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

                <h2> Income </h2>
                <div className="table">
                    <table id="incomeTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Period</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finance.finances
                                .filter((y: any) => y.type == "INCOME")
                                .filter((y: any) => {
                                    if (month == 'all') {
                                        return Moment(year, 'YYYY').isSame(y.start, 'year')
                                            || (
                                                y.end != undefined
                                                && Moment(year, 'YYYY').isSameOrBefore(y.end, 'year')
                                                && Moment(year, 'YYYY').isSameOrAfter(y.start, 'year')
                                            )
                                            || (y.end == undefined && Moment(year, 'YYYY').isSameOrAfter(y.start, 'year'))
                                    }

                                    return calculateOccurancesInMonth(date, y) >= 1;
                                })
                                .sort((x: any, y: any) => Moment(y.start).valueOf() - Moment(x.start).valueOf())
                                .map((x: any) => {
                                    return (
                                        <tr key={x.id}>
                                            <td> {x.title} </td>
                                            <td>
                                                $
                                                {parseFloat(
                                                    x.amount
                                                ).toLocaleString("en-US")}
                                            </td>
                                            <td> {ConvertCase.toSentenceCase(x.period)} </td>
                                            <td>
                                                {Moment(x.start).format(
                                                    "MM/DD/YYYY"
                                                )}
                                            </td>
                                            <td>
                                                {x.end != undefined
                                                    ? Moment(x.end).format(
                                                        "MM/DD/YYYY"
                                                    )
                                                    : "None"}
                                            </td>
                                            <td className="tableActions">
                                                <EditIncome current={x} />
                                                <DeleteFinance title={x.title} amount={x.amount} id={x.id} />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    <CreateIncome />
                </div>

                <h2> Expenses </h2>
                <div className="table">
                    <table id="incomeTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Period</th>
                                <th>Category</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finance.finances
                                .filter((y: any) => y.type == "EXPENSE")
                                .filter((y: any) => {
                                    if (month == 'all') {
                                        return Moment(year, 'YYYY').isSame(y.start, 'year')
                                            || (
                                                y.end != undefined
                                                && Moment(year, 'YYYY').isSameOrBefore(y.end, 'year')
                                                && Moment(year, 'YYYY').isSameOrAfter(y.start, 'year')
                                            )
                                            || (y.end == undefined && Moment(year, 'YYYY').isSameOrAfter(y.start, 'year'))
                                    }

                                    return calculateOccurancesInMonth(date, y) >= 1;
                                })
                                .sort((x: any, y: any) => Moment(y.start).valueOf() - Moment(x.start).valueOf())
                                .map((x: any) => {
                                    return (
                                        <tr key={x.id}>
                                            <td> {x.title} </td>
                                            <td>
                                                $
                                                {parseFloat(
                                                    x.amount
                                                ).toLocaleString("en-US")}
                                            </td>
                                            <td> {ConvertCase.toSentenceCase(x.period)} </td>
                                            <td> {ConvertCase.toSentenceCase(x.category)} </td>
                                            <td>
                                                {Moment(x.start).format(
                                                    "MM/DD/YYYY"
                                                )}
                                            </td>
                                            <td>
                                                {x.end != undefined
                                                    ? Moment(x.end).format(
                                                        "MM/DD/YYYY"
                                                    )
                                                    : "None"}
                                            </td>
                                            <td className="tableActions">
                                                <EditExpense current={x} />
                                                <DeleteFinance title={x.title} amount={x.amount} id={x.id} />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    <CreateExpense />
                </div>
            </div>
        </Container>
    );
};

export default withPageAuthRequired(FinanceDashboard);
