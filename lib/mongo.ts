import mongoose from "mongoose";

if (process.env.MongoUri == undefined) {
    throw new Error("MongoUri environment variable is not defined");
}

let cachedDb: mongoose.Mongoose | undefined = undefined;
export async function connect() {
    if (cachedDb != undefined) {
        return cachedDb;
    }

    cachedDb = await mongoose.connect(process.env.MongoUri as string);
    return cachedDb;
}
export default connect;
