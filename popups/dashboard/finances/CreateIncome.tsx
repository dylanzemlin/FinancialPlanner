import { NextPage } from "next";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";
import Moment from 'moment';
import { useRouter } from "next/router";
import Popup from "reactjs-popup";

const CreateIncome: NextPage = (props) => {

	const [title, setTitle] = useState("");
	const [startDate, setStartDate] = useState(Moment().format("MM/DD/YYYY"));
	const [endDate, setEndDate] = useState("");
	const [amount, setAmount] = useState(0);
	const [type, setType] = useState("weekly");

    const router = useRouter();

	const createIncome = async () => {
		let financePost = await fetch("/api/user/finance/", {
			method: "POST",
			body: JSON.stringify({
				financeType: "INCOME",
				financeStart: startDate,
				financeEnd: endDate,
				financeAmount: amount,
				financePeriod: type,
				financeTitle: title,
                financeId: uuidv4()
			}),
		});

		if (financePost.status == 200) {
			// Refresh Page
			router.reload();
		} else {
			toast.error(
				`Failed to create income: ${await financePost.text()}`
			);
		}
	};

	return <Popup
		contentStyle={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			gap: "1.2rem",
		}}
		trigger={<button style={{ marginTop: "0.4rem" }}>Add Expense</button>}
		modal
		nested
	>
		<h3> Create Income </h3>

		<div className="flex column centered">
			<label htmlFor="title"> * Title </label>
			<input
				type="text"
				id="title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				style={{ marginTop: "0.25rem" }}
				placeholder="Venmo from Bob"
			/>
		</div>

		<div className="flex column centered">
			<label htmlFor="amount"> * Amount </label>
			<span>
				$
				<input
					type="number"
					id="amount"
                    step="any"
                    min="0"
					value={amount}
					onChange={(e) => setAmount(parseFloat(e.target.value))}
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
			<input type="submit" value="Create" onClick={createIncome} />
		</div>
	</Popup>;
};
export default CreateIncome;
