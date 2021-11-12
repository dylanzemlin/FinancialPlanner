import mongoose from 'mongoose'

export interface IFinance {
    baseIncome: number,
    incomePeriod: number
}

const FinanceSchema = new mongoose.Schema<IFinance>({
    baseIncome: Number,
    incomePeriod: Number
})

export default mongoose.models.Finance || mongoose.model<IFinance>('Finance', FinanceSchema, 'finances');