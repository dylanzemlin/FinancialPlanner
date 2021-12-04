import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Popup from "reactjs-popup";

const DeleteFinance: NextPage<{
    id: string,
    title: string,
    amount: string
}> = (props) => {
    const router = useRouter();

    const onDelete = async () => {
        const response = await fetch("/api/user/finance/", {
            method: "DELETE",
            body: JSON.stringify({ id: props.id }),
        });
        console.log(response);

        router.reload();
    };

    return (
        <Popup
            contentStyle={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "0.7rem",
            }}
            trigger={<button className="tableAction">X</button>}
            modal
            nested
        >
            <h3> Delete Confirmation </h3>

            <p>
                Are you sure you want to delete this finance? This action is not
                reversable.
            </p>

            <p>
                Finance: {props.title} for ${props.amount}
            </p>

            <button
                onClick={(e) => onDelete()}
                style={{
                    padding: "0.3rem 0.8rem",
                    boxShadow: "0px 0px 15px 1px var(--color-bg-primary)"
                }}
            >
                Delete
            </button>
        </Popup>
    );
};
export default DeleteFinance;
