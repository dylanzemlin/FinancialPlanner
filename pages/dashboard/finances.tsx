// pages/index.js
import { useUser } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Popup } from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import Navbar from "../../components/nav";
import Moment from "moment";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";

const Dashboard: NextPage = (props) => {
	const { user, error, isLoading } = useUser();
	const { response: userData, responseError, fetching } = useApi("/api/user");
	let {
		response: financeData,
		responseError: financeError,
		fetching: financeFetching,
	} = useApi("/api/user/finance/");

	const [title, setTitle] = useState("");
	const [startDate, setStartDate] = useState(Moment().format("MM/DD/YYYY"));
	const [endDate, setEndDate] = useState("");
	const [amount, setAmount] = useState("0");
	const [category, setCategory] = useState("entertainment");
	const [type, setType] = useState("weekly");

	const router = useRouter();

	if (error || responseError) {
		return <p> Error: {error + " | " + responseError} </p>;
	}

	if (user == undefined) {
		return (
			<Container title="ENGR 1411 | Finance Dashboard" loading={true} />
		);
	}

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

	if (userData?.code == 404 || financeError) {
		return (
			<Container title="ENGR 1411 | Finance Dashboard" loading={true} />
		);
	}

	const parseNum = (num: string): string => {
		console.log(num + " | " + amount);
		let numPeriods = num.split("").filter((x) => x == ".").length;
		if (numPeriods > 1) {
			return amount;
		}

		if (numPeriods != 0) {
			if (num.indexOf(".") == -1) {
				return parseInt(amount).toString();
			}

			if (num.lastIndexOf(".") == num.length - 1) {
				return parseFloat(amount) + ".";
			}

			if (num.lastIndexOf(".") == 0) {
				return "." + parseFloat(amount);
			}
		}

		return parseFloat(num).toString();
	};

	const resetInputs = () => {
		setTitle("");
		setAmount("0.0");
		setType("weekly");
        setStartDate(Moment().format("MM/DD/YYYY"));
	};

	const validateInputs = (): boolean => {
		if (title.trim() == "") {
			toast.error("You must have a title to create a expense/income!");
			return false;
		}
		if (isNaN(parseFloat(amount)) || amount == "0") {
			toast.error(
				"You must input a valid amount to create a expense/income!"
			);
			return false;
		}

		return true;
	};

	const createIncome = async () => {
		console.log(
			`Attempting to create income \"${title}\" for amount $${amount} and type: ${type}`
		);
		if (!validateInputs()) return;

		let financePost = await fetch("/api/user/finance/", {
			method: "POST",
			body: JSON.stringify({
				financeType: "INCOME",
				financeStart: startDate,
				financeEnd: endDate,
				financeAmount: amount,
				financePeriod: type,
				financeTitle: title,
			}),
		});

		if (financePost.status == 200) {
			// Refresh Page
			router.reload();
		} else {
			toast.error(`Failed to create income: ${await financePost.text()}`);
		}
	};

	const createExpense = async () => {
		if (!validateInputs()) return;

		let financePost = await fetch("/api/user/finance/", {
			method: "POST",
			body: JSON.stringify({
				financeType: "EXPENSE",
				financeStart: startDate,
				financeEnd: endDate,
				financeCategory: category,
				financeAmount: amount,
				financePeriod: type,
				financeTitle: title,
			}),
		});

		if (financePost.status == 200) {
			// Refresh Page
			router.reload();
		} else {
			toast.error(
				`Failed to create expense: ${await financePost.text()}`
			);
		}
	};

	return (
		<Container
			title="ENGR 1411 | Finance Dashboard"
			className={"flex"}
			loading={isLoading || fetching}
		>
			<Navbar />

			<div className="flex column width-fill">
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
												{" "}
												$
												{parseFloat(
													x.amount
												).toLocaleString("en-US")}{" "}
											</td>
											<td> {x.period} </td>
											<td>
												{" "}
												{Moment(x.start).format(
													"MM/DD/YYYY"
												)}{" "}
											</td>
											<td></td>
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

					<Popup
						contentStyle={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							gap: "1.2rem",
						}}
						trigger={
							<button style={{ marginTop: "0.4rem" }}>
								Add Income
							</button>
						}
						modal
						nested
						onClose={resetInputs}
					>
						<h3> Create Income </h3>

						<div className="flex column centered">
							<label htmlFor="title"> * Income Title </label>
							<input
								type="text"
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								placeholder="Spotify"
							/>
						</div>

						<div className="flex column centered">
							<label htmlFor="amount"> * Income Amount </label>
							<span>
								$
								<input
									type="text"
									id="amount"
									value={amount}
									onChange={(e) => {
										if (e.target.value.length == 0) {
											setAmount("0");
										} else {
											setAmount(
												parseNum(
													e.target.value
												).toString()
											);
										}
									}}
									style={{ marginTop: "0.25rem" }}
									placeholder="$0.00"
								/>
							</span>
						</div>

						<div className="flex column">
							<label htmlFor="state"> * State </label>
							<select
								onChange={(e) => setType(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								value={type}
							>
								<option value="once"> One Time </option>
								<option value="daily"> Daily </option>
								<option value="weekly"> Weekly </option>
								<option value="biweekly"> Bi-Weekly </option>
								<option value="monthly"> Monthly </option>
								<option value="yearly"> Yearly </option>
							</select>
						</div>

						<div className="flex column centered">
							<label htmlFor="start"> * Start Date </label>
							<input
								type="text"
								id="start"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								placeholder="11/29/2021"
							/>
						</div>

						<div className="flex column centered">
							<label htmlFor="end"> End Date </label>
							<input
								type="text"
								id="end"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								placeholder="11/29/2022"
							/>
						</div>

						<div>
							<input
								type="submit"
								value="Create"
								onClick={createIncome}
							/>
						</div>
					</Popup>
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
											<td></td>
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

					<Popup
						contentStyle={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							gap: "1.2rem",
						}}
						trigger={
							<button style={{ marginTop: "0.4rem" }}>
								Add Expense
							</button>
						}
						modal
						nested
						onClose={resetInputs}
					>
						<h3> Create Expense </h3>

						<div className="flex column centered">
							<label htmlFor="title"> * Title </label>
							<input
								type="text"
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								placeholder="Spotify"
							/>
						</div>

						<div className="flex column centered">
							<label htmlFor="amount"> * Amount </label>
							<span>
								$
								<input
									type="text"
									id="amount"
									value={amount}
									onChange={(e) => {
										if (e.target.value.length == 0) {
											setAmount("0");
										} else {
											setAmount(
												parseNum(
													e.target.value
												).toString()
											);
										}
									}}
									style={{ marginTop: "0.25rem" }}
									placeholder="$0.00"
								/>
							</span>
						</div>

						<div className="flex column">
							<label htmlFor="state"> * State </label>
							<select
								onChange={(e) => setType(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								value={type}
							>
								<option value="once"> One Time </option>
								<option value="daily"> Daily </option>
								<option value="weekly"> Weekly </option>
								<option value="biweekly"> Bi-Weekly </option>
								<option value="monthly"> Monthly </option>
								<option value="yearly"> Yearly </option>
							</select>
						</div>

						<div className="flex column">
							<label htmlFor="category"> * Category </label>
							<select
								onChange={(e) => setCategory(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								value={category}
							>
								<option value="entertainment">
									{" "}
									Entertainment{" "}
								</option>
								<option value="grocery"> Grocery </option>
								<option value="food"> Food </option>
								<option value="gas"> Gas </option>
								<option value="school"> School </option>
							</select>
						</div>

						<div className="flex column centered">
							<label htmlFor="start"> * Start Date </label>
							<input
								type="text"
								id="start"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								placeholder="11/29/2021"
							/>
						</div>

						<div className="flex column centered">
							<label htmlFor="end"> End Date </label>
							<input
								type="text"
								id="end"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								style={{ marginTop: "0.25rem" }}
								placeholder="11/29/2022"
							/>
						</div>

						<div>
							<input
								type="submit"
								value="Create"
								onClick={createExpense}
							/>
						</div>
					</Popup>
				</div>
			</div>
		</Container>
	);
};

export default Dashboard;
