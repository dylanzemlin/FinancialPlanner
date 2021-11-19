import mongoose from 'mongoose'

export interface FinanceItem {
    type: string,
    title: string,
    amount: string,
    period: string
}

export interface IFinance {
    userId: string,
    finances: FinanceItem[]
}

const FinanceSchema = new mongoose.Schema<IFinance>({
    userId: String,
    finances: [{
        type: String,
        title: String,
        amount: String,
        period: String
    }],
}, { typeKey: '$type' })

export default mongoose.models.Finance || mongoose.model<IFinance>('Finance', FinanceSchema, 'finances');