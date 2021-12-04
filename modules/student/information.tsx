import { NextPage } from "next";

const StudentInformation: NextPage<{
    info: any;
}> = (props) => {
    return (
        <div>
            <h2> Welcome, {props.info.firstName}! </h2>

            <p> Email: {props.info.email} </p>
            <p> Sooner ID: {props.info.soonerId} </p>
            <p> Sooner Net ID: {props.info.netId} </p>
        </div>
    );
};

export default StudentInformation;
