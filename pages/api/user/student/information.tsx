import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import * as OUtils from "../../../../utils/ou-utils";
import mongoConnect from "../../../../lib/mongo";
import StudentModel from "../../../../models/student";

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
	const session = getSession(req, res);
	if (session == undefined || session == null) {
		return res
			.status(403)
			.json({ code: 403, dataText: "No authorization session found" });
	}

	await mongoConnect();

	if (req.method == "POST") {
		const json = JSON.parse(req.body);
		const cookie = json.cookie;
		const userId = json.userId;

		if (cookie == undefined || userId == undefined) {
			return res
				.status(400)
				.json({ code: 400, dataText: "Invalid body provided" });
		}

		const info = await OUtils.getStudentInformation(cookie, userId);
		if (info == undefined) {
			return res.status(400).json({
				code: 400,
				dataText:
					"There was an error fetching your OU Student Information",
			});
		}

		await StudentModel.create({
			userId: session.user.sub,
			firstName: info.firstName,
			lastName: info.lastName,
			email: info.dottedEmail,
			soonerId: info.soonerId,
			netId: info.ouNetId,
		});

		return res.status(200).json({
			code: 200,
			dataObject: info,
		});
	} else if (req.method == "GET") {
		const model = await StudentModel.findOne({
			userId: session.user.sub,
		});
		if (model == null) {
			return res
				.status(404)
				.json({ code: 404, dataText: "No student information found" });
		}

		return res.status(200).json({
			code: 200,
			dataBody: model,
		});
	}

	return res
		.status(400)
		.json({ code: 400, dataText: "Invalid method: " + req.method });
});
