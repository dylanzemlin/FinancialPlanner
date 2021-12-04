import mongoose from "mongoose";

export interface FinanceItem {
    id: string;

    type: string;
    category: string;
    title: string;
    period: string;

    amount: number;

    start: Date;
    end?: Date;
}

export interface IFinance {
    userId: string;
    finances: FinanceItem[];
}

const FinanceSchema = new mongoose.Schema<IFinance>(
    {
        userId: String,
        finances: [
            {
                id: String,
                type: String,
                category: String,
                title: String,
                period: String,

                amount: Number,

                start: Date,
                end: Date,
            },
        ],
    },
    { typeKey: "$type" }
);

export default mongoose.models.Finance ||
    mongoose.model<IFinance>("Finance", FinanceSchema, "finances");
