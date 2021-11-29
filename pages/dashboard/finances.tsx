// pages/index.js
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Navbar from "../../components/nav";
import Moment from "moment";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import CreateExpense from "../../popups/dashboard/finances/CreateExpense";
import CreateIncome from "../../popups/dashboard/finances/CreateIncome";

const FinanceDashboard: NextPage = (props) => {
	const { user, error, isLoading } = useUser();
	const { response: userData, responseError, fetching } = useApi("/api/user");
	let {
		response: financeData,
		responseError: financeError,
		fetching: financeFetching,
	} = useApi("/api/user/finance/");

	if (
		userData == undefined ||
		financeData == undefined ||
		fetching ||
		financeFetching
	) {
		return (
			<Container title="ENGR 1411 | Finance Dashboard" loading={true} />
		);
	}

	return (
		<Container
			title="ENGR 1411 | Finance Dashboard"
			className={"flex"}
			loading={isLoading || fetching}
		>
			<Navbar />

			<div className="flex column width-fill" style={{ paddingRight: "1rem" }}>
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
							{financeData.finances
								.filter((y: any) => y.type == "INCOME")
								.map((x: any) => {
									return (
										<tr>
											<td> {x.title} </td>
											<td>
												$
												{parseFloat(
													x.amount
												).toLocaleString("en-US")}
											</td>
											<td> {x.period} </td>
											<td>
												{Moment(x.start).format(
													"MM/DD/YYYY"
												)}
											</td>
                                            <td>
												{x.end != undefined ? Moment(x.end).format(
													"MM/DD/YYYY"
												) : "None"}
											</td>
											<td className="tableActions">
												<button className="tableAction">
													<FontAwesomeIcon
														icon={faHammer}
													/>
												</button>
												<button className="tableAction">
													X
												</button>
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
							{financeData.finances
								.filter((y: any) => y.type == "EXPENSE")
								.map((x: any) => {
									return (
										<tr>
											<td> {x.title} </td>
											<td>
												$
												{parseFloat(
													x.amount
												).toLocaleString("en-US")}
											</td>
											<td> {x.period} </td>
											<td> {x.category} </td>
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
												<button className="tableAction">
													<FontAwesomeIcon
														icon={faHammer}
													/>
												</button>
												<button className="tableAction">
													X
												</button>
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
