// pages/index.js
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import React from "react";
import Navbar from "../../components/nav";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";

import Authenticate from "../../modules/student/authenticate";
import Information from "../../modules/student/information";

const StudentDashboard: NextPage = (props) => {
	const { user, error, isLoading } = useUser();
	const { response: userData, responseError, fetching } = useApi("/api/user");
	let {
		response: studentData,
		responseError: studentError,
		fetching: studentFetching,
	} = useApi("/api/user/student/information");

	if (error || responseError) {
		return <p> Error: {error + " | " + responseError} </p>;
	}

	if (user == undefined) {
		return (
			<Container title="ENGR 1411 | Student Dashboard" loading={true} />
		);
	}

	if (
		userData == undefined ||
		studentData == undefined ||
		fetching ||
		studentFetching
	) {
		return (
			<Container title="ENGR 1411 | Student Dashboard" loading={true} />
		);
	}

	if (userData?.code == 404 || studentError) {
		return (
			<Container title="ENGR 1411 | Student Dashboard" loading={true} />
		);
	}

	return (
		<Container
			title="ENGR 1411 | Student Dashboard"
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
					Student Dashboard
				</h1>

				{studentData?.code != 200 ? (
					<Authenticate />
				) : (
					<Information info={studentData.dataBody} />
				)}
			</div>
		</Container>
	);
};

export default withPageAuthRequired(StudentDashboard);
