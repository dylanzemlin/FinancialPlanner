// pages/index.js
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import React from "react";
import Navbar from "../../components/nav";
import Moment from "moment";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import CreateExpense from "../../popups/dashboard/finances/CreateExpense";
import CreateIncome from "../../popups/dashboard/finances/CreateIncome";
import DeleteExpense from "../../popups/dashboard/finances/DeleteExpense";
import EditExpense from "../../popups/dashboard/finances/EditExpense";
import EditIncome from "../../popups/dashboard/finances/EditIncome";
import ConvertCase from "js-convert-case";

const FinanceDashboard: NextPage = (props) => {
    let {
        response: finance,
        fetching,
    } = useApi("/api/user/finance/");

    if (finance == undefined || fetching) {
        return (
            <Container title="ENGR 1411 | Finance Dashboard" loading={true} />
        );
    }

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

                <h2> Income Sources </h2>
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
                                                <DeleteExpense id={x.id} />
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
                                                <DeleteExpense id={x.id} />
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
