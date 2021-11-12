import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import User from '../../../models/user';
import Finance from '../../../models/finance';
import mongoConnect from '../../../lib/mongo';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
    const session = getSession(req, res);
    if(session == undefined || session == null) {
        return res.status(403).json({ code: 403, dataText: "No authorization session found" });
    }

    await mongoConnect();

    if(req.method == 'GET') {
        let user = await User.findOne({ authId: session?.user.sub ?? '' });
        if(user == null) {
            return res.status(403).json({ code: 404, dataText: "No user found" });
        }
    
        return res.status(200).json(user);
    } else if (req.method == 'POST') {
        let user = await User.findOne({ authId: session?.user.sub ?? '' });
        if(user != null) {
            return res.status(400).json({ code: 400, dataText: "User already exists" });
        }

        const bod = JSON.parse(req.body);

        const newFinanceDoc = await new Finance({
            incomePeriod: -1,
            baseIncome: -1
        }).save();

        const newUserDoc = await new User({
            name: bod.name,
            age: bod.age,
            financeId: newFinanceDoc.id,
            authId: session?.user.sub ?? ''
        }).save();

        return res.status(200).json({ code: 200, dataText: "success" });
    }

    return res.status(400).json({ code: 400, dataText: "Invalid method: " + req.method });
});