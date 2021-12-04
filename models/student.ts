import mongoose from "mongoose";

export interface IStudent {
    userId: string;
    firstName: string;
    lastName: string;
    soonerId: string;
    netId: string;
    email: string;
}

const StudentSchema = new mongoose.Schema<IStudent>(
    {
        userId: String,
        firstName: String,
        lastName: String,
        soonerId: String,
        netId: String,
        email: String,
    },
    { typeKey: "$type" }
);

export default mongoose.models.Student ||
    mongoose.model<IStudent>("Student", StudentSchema, "students");
