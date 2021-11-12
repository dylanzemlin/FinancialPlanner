import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import mongoConnect from '../../../lib/mongo';


export default withApiAuthRequired(async function ProtectedRoute(req, res) {
    const session = getSession(req, res);
    if(session == undefined || session == null) {
        return res.status(403).json({ code: 403, dataText: "No authorization session found" });
    }

    await mongoConnect();

    res.status(200).json({ echoId: session?.user.sub });
});