import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import React from "react";
import Popup from "reactjs-popup";

const SaveAccountSettings: NextPage<{
    editedFields: Record<string, { from: string, to: string }>
}> = (props) => {

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
            border: "1px solid var(--color-primary)"
        }}> Save Settings </button>}
        modal
        nested
    >
        <h3 style={{ margin: "0", marginTop: "1.3rem" }}> Save Settings </h3>

        <div>
            <h3> Changed Fields </h3>
            {Object.keys(props.editedFields).map(key => {
                const data = props.editedFields[key];
                return <p>
                    <b> {key} </b> {<FontAwesomeIcon icon={faArrowRight} />} <b> {data.from} </b> to <b> {data.to} </b>.
                </p>
            })}
        </div>

        <div>
            <input type="submit" value="Confirm" />
        </div>
    </Popup>;
};
export default SaveAccountSettings;
