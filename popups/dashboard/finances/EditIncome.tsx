import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { NextPage } from "next";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import Moment from "moment";

const EditIncome: NextPage<{ current: any }> = (props) => {
    const [title, setTitle] = useState(props.current.title as string);
    const [startDate, setStartDate] = useState(Moment(props.current.start).format("MM/DD/YYYY"));
    const [endDate, setEndDate] = useState((props.current.end as string) ?? "");
    const [amount, setAmount] = useState(props.current.amount as number);
    const [type, setType] = useState(props.current.type as string);

    const router = useRouter();

    const editIncome = async () => {
        let financePost = await fetch("/api/user/finance/", {
            method: "PATCH",
            body: JSON.stringify({
                financeType: "INCOME",
                financeStart: startDate,
                financeEnd: endDate,
                financeAmount: amount,
                financePeriod: type,
                financeTitle: title,
                financeId: props.current.id,
            }),
        });

        if (financePost.status == 200) {
            // Refresh Page
            router.reload();
        } else {
            toast.error(`Failed to edit income: ${await financePost.text()}`);
        }
    };

    return (
        <Popup
            contentStyle={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "1.2rem",
            }}
            trigger={
                <button className="tableAction"> <FontAwesomeIcon icon={faHammer} /> </button>
            }
            modal
            nested
        >
            <h3> Edit Expense </h3>

            <div className="flex column centered">
                <label htmlFor="title"> Title </label>
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
                <label htmlFor="amount"> Amount </label>
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
                <label htmlFor="state"> State </label>
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
                <label htmlFor="start"> Start Date </label>
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
                <input type="submit" value="Edit" onClick={editIncome} />
            </div>
        </Popup>
    );
};
export default EditIncome;
