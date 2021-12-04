import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import User from '@/models/user';
import Finance from '@/models/finance';
import Student from '@/models/student';
import mongoConnect from '@/lib/mongo';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
    const session = getSession(req, res);
    if (session == undefined || session == null) {
        return res.status(403).json({ code: 403, dataText: "Not Authorized" });
    }

    await mongoConnect();

    if (req.method == 'GET') {
        let user = await User.findOne({ authId: session?.user.sub ?? '' });
        if (user == null) {
            return res.status(403).json({ code: 404, dataText: "No user found" });
        }

        return res.status(200).json(user);
    } else if (req.method == 'POST') {
        let user = await User.findOne({ authId: session?.user.sub ?? '' });
        if (user != null) {
            return res.status(400).json({ code: 400, dataText: "User already exists" });
        }

        const reqBody = JSON.parse(req.body);

        await new Finance({
            incomePeriod: -1,
            baseIncome: -1,
            userId: session?.user.sub ?? ''
        }).save();

        await new User({
            name: reqBody.name,
            age: reqBody.age,
            authId: session?.user.sub ?? ''
        }).save();

        return res.status(200).json({ code: 200, dataText: "success" });
    } else if (req.method == 'DELETE') {

        await Finance.deleteOne({
            userId: session?.user.sub ?? ''
        });

        await User.deleteOne({
            userId: session?.user.sub ?? ''
        });

        await Student.deleteOne({
            userId: session?.user.sub ?? ''
        });

        return res.status(200).json({ code: 200, dataText: "success" });

    }

    return res.status(400).json({ code: 400, dataText: "Invalid method: " + req.method });
});