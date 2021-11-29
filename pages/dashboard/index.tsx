// pages/index.js
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import * as FinanceUtils from "../../utils/finance-utils";

import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import React from "react";
import Navbar from "../../components/nav";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import NewUser from "../../modules/dashboard/newuser";

import ConvertCase from "js-convert-case";

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
	const summary = FinanceUtils.calculateMonthlyFinances(date, financeData);
	let data: Record<
		string,
		{
			name: string;
			value: number;
		}[]
	> = {};
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

	let colorIdx = 0;
	const colors: string[] = ["#123456", "#581235", "#f9e23e", "#0a230f"];

	return (
		<Container
			title="ENGR 1411 | Dashboard"
			className={"flex"}
			loading={isLoading || fetching}
		>
			<Navbar />

			<div style={{ overflowY: "scroll", width: "100%" }}>
				<h1
					style={{
						borderBottom: "2px solid var(--color-bg-secondary)",
						marginBottom: "0.2rem",
					}}
				>
					{" "}
					Welcome back, {userData.name}!{" "}
				</h1>

				<div style={{ width: "100%", marginBottom: "2rem" }}>
					<h2>
						{" "}
						Summary for{" "}
						{new Date().toLocaleString("default", {
							month: "long",
						})}{" "}
						({date.getMonth() + 1}/01/{date.getFullYear()} to{" "}
						{date.getMonth() + 1}/{date.getDate()}/
						{date.getFullYear()}):{" "}
					</h2>

					<div className="flex" style={{ gap: "3rem" }}>
						<div>
							<h3> Statistics </h3>
							<p>
								{" "}
								Gross Income: $
								{summary.gross.income.toLocaleString()}{" "}
							</p>
							<p>
								{" "}
								Gross Expenses: $
								{summary.gross.expense.toLocaleString()}{" "}
							</p>
							<p> Profit: ${summary.profit.toLocaleString()} </p>
						</div>
					</div>

					<h3 style={{ width: "100%", textAlign: "center" }}>
						{" "}
						Expenses{" "}
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
								label={true}
								labelLine={true}
							>
								{[...Object.keys(data)].map((key) => {
									return (
										<Cell
											fill={`${
												colors[
													colorIdx++ % colors.length
												]
											}`}
										/>
									);
								})}
							</Pie>
							<Tooltip />
							<Legend fill="#fff" />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</Container>
	);
};

export default withPageAuthRequired(Dashboard);
