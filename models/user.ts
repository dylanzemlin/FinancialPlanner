import mongoose, { mongo, Schema } from 'mongoose'

export interface IUser {
    name: string,
    age: number,
    authId: string
}

const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    authId: { type: String, required: true },
    age: { type: Number, min: 16, max: 120 }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'users');