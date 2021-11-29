import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import FinanceModel from '../../../../models/finance';
import mongoConnect from '../../../../lib/mongo';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
    const session = getSession(req, res);
    if(session == undefined || session == null) {
        return res.status(403).json({ code: 403, dataText: "No authorization session found" });
    }

    await mongoConnect();

    if(req.method == 'GET') {
        const userFinances = await FinanceModel.findOne({
            userId: session?.user.sub ?? ''
        });

        if(userFinances == null) {
            return res.status(404).json({ code: 404, dataText: `No Finances Found` });
        }

        return res.status(200).json({ code: 200, finances: userFinances.finances });
    } else if (req.method == 'POST') {

        let body: any = undefined;
        try {
            body = JSON.parse(req.body);
        } catch {
            return res.status(400).json({ code: 400, dataText: `Invalid Body Provided` });
        }

        if(body == undefined) {
            return res.status(400).json({ code: 400, dataText: `Invalid Body Provided` });
        }

        // Create New Finance
        const postType: string = body.financeType ?? "NONE";
        if(postType != 'EXPENSE' && postType != 'INCOME') {
            return res.status(400).json({ code: 400, dataText: `Invalid Type: ${postType}` });
        }

        const postAmount: number = body.financeAmount ?? 0;
        if(isNaN(postAmount) || postAmount <= 0) {
            return res.status(400).json({ code: 400, dataText: `Invalid Amount: ${postAmount}` });
        }

        const postPeriod: string = body.financePeriod ?? "NONE";
        if(!(['once', 'daily', 'weekly', 'biweekly', 'monthly', 'yearly'].includes(postPeriod))) {
            return res.status(400).json({ code: 400, dataText: `Invalid Period: ${postPeriod}` });
        }

        const postTitle: string = body.financeTitle ?? "";
        if(postTitle.length <= 0 || postTitle.length >= 20) {
            return res.status(400).json({ code: 400, dataText: `Invalid Title Length: ${postTitle.length}` });
        }

        const postStart: string = body.financeStart ?? "";
        const postEnd: string | undefined = body.financeEnd == "" ? undefined : body.financeEnd;
        const postCategory: string = body.financeCategory;

        let financeBody: any = {
            title: postTitle,
            period: postPeriod,
            amount: postAmount,
            start: postStart,
            end: postEnd,
            type: postType
        };
        if(postType == "EXPENSE") {
            financeBody.category = postCategory;
        }

        await FinanceModel.updateOne({
            userId: session?.user.sub ?? ''
        }, {
            $push: {
                finances: financeBody
            }
        });
        
        return res.status(200).json({ code: 200 });
    } else if (req.method == 'DELETE') {
        // Delete a finance
    } else if (req.method == 'PATCH') {
        // Patch a finance
    }

    res.status(405).json({ code: 405, dataText: `Method ${req.method} not allowed` });
});