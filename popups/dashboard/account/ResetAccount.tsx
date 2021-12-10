import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import crypto from 'crypto';

const ResetAccount: NextPage = (props) => {

    const [curCode, setCode] = useState("");
    const [realCode, setRealCode] = useState(crypto.randomBytes(4).toString('hex'));

    const router = useRouter();

    const sendResetRequest = async () => {

        if (curCode != realCode) {
            toast.error(`Invalid Code Entered`);
            return;
        }

        // TODO: Send Reset Request
        const deleteReq = await fetch('/api/user/', {
            method: 'DELETE'
        });

        if (deleteReq.status == 200) {
            router.push('/dashboard');
            return;
        }

        toast.error(`There was an error resetting your profile: ${await deleteReq.text()}`);

    };

    return <Popup
        contentStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1.2rem"
        }}
        className="popup"
        trigger={<button style={{
            marginTop: "0.4rem",
            padding: "0.35rem 0.6rem",
            textAlign: "left",
            background: "var(--color-table-cell)",
            border: "1px solid var(--color-error)"
        }}> Reset Account Data </button>}
        modal
        nested
    >
        <h3> Reset Account Data </h3>

        <p className="flex column center">
            Are you sure you want to reset your account data? If so, please enter the following confirmation code into the box below
            <b style={{ textAlign: "center", fontSize: "1.25rem", marginTop: "0.5rem" }}>
                {realCode}
            </b>
        </p>

        <div className="flex column centered">
            <label htmlFor="code"> Confirmation Code </label>
            <input
                type="text"
                id="code"
                value={curCode}
                onChange={(e) => setCode(e.target.value)}
                style={{ marginTop: "0.25rem" }}
            />
        </div>

        <div>
            <input disabled type="submit" value="Reset" onClick={sendResetRequest} />
        </div>
    </Popup>;
};
export default ResetAccount;
