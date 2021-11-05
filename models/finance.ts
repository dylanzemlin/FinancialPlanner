import mongoose from 'mongoose'

export interface FinanceModel {
    baseIncome: number,
    incomePeriod: number
}

const FinanceSchema = new mongoose.Schema({
    baseIncome: Number,
    incomePeriod: Number
})

module.exports = 
    mongoose.models.Finance 
        || 
    mongoose.model<FinanceModel>('Finance', FinanceSchema, 'finances')