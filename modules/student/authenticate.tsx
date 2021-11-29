import { NextPage } from "next";
import { useState } from "react";
import { toast } from "react-toastify";
import * as OUtils from "../../utils/ou-utils";

const StudentAuthentication: NextPage = (props) => {
	const [cookieVal, setCookie] = useState("");
	const [userIdVal, setUserId] = useState("");

	const authenticateUser = async () => {
		console.log(cookieVal);
		console.log(userIdVal);

		const userData = await fetch("/api/user/student/information", {
			method: "POST",
			body: JSON.stringify({
				cookie: cookieVal,
				userId: userIdVal,
			}),
		});
		if (userData == undefined) {
			toast.error(
				"Failed to fetch OU Student Information, please check your cookie and try again!"
			);
			return;
		}

		console.log(await userData.json());
	};

	return (
		<div>
			<h2> Welcome! </h2>

			<p>
				It seems you have not authenticated with student services yet,
				please paste your cookie and X-User-Id below!
			</p>

			<div style={{ gap: "1rem" }} className="flex column">
				<div className="flex column">
					<label htmlFor="cookie"> Cookie </label>
					<input
						type="text"
						id="cookie"
						value={cookieVal}
						onChange={(e) => setCookie(e.target.value)}
						style={{ marginTop: "0.25rem" }}
					/>
				</div>

				<div className="flex column">
					<label htmlFor="userid"> X-User-Id </label>
					<input
						type="text"
						id="userid"
						value={userIdVal}
						onChange={(e) => setUserId(e.target.value)}
						style={{ marginTop: "0.25rem" }}
					/>
				</div>

				<div>
					<input
						type="submit"
						value="Create"
						onClick={authenticateUser}
					/>
				</div>
			</div>
		</div>
	);
};

export default StudentAuthentication;
