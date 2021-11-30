import { FinanceItem, IFinance } from "../models/finance";
import { compareDates } from "./date-utils";
import Moment from 'moment';

/**
 * 
 * Calculates the number of times a finance occurs up until a specified date
 * 
 * @param date The end date
 * @param finance The finance itself
 * @returns The number of times the finance occurs until the date
 */
export function calculateOccurancesUntilDate(date: Date, finance: FinanceItem): number {
    let occurances: number = 0;
    let curDate = Moment(finance.start);

    // To be safe we are going to include a timeout to avoid infinite loops
    // The timeout specified leaves room for up to 5 years of a daily finance to be calculated
    let timeout = 0;
    while (timeout++ <= (365 * 5)) {
        const compare = compareDates(curDate.toDate(), date, { day: true, month: true, year: true });
        if(compare > 0) break;

        occurances++;
        switch(finance.period) {
            case 'yearly': curDate = curDate.add('1', 'year'); break;
            case 'monthly': curDate = curDate.add('1', 'month'); break;
            case 'bi-weekly': curDate = curDate.add('2', 'weeks'); break;
            case 'weekly': curDate = curDate.add('1', 'week'); break;
            case 'daily': curDate = curDate.add('1', 'day'); break;
            default: return occurances; // This shouldn't happen realistically, but to be safe
        }
    }

    return occurances;
}

/**
 * 
 * Calculates the number of times a finance occurs within a month
 * 
 * @param date The month to be checked
 * @param finance The finance to be checked
 * @returns The number of times the finance occurs in the specified month
 */
export function calculateOccurancesInMonth(date: Date, finance: FinanceItem): number {
    const moment = Moment(date);
    return calculateOccurancesUntilDate(new Date(date.getFullYear(), date.getMonth(), moment.daysInMonth()), finance)
}

/**
 *
 * Generates a monthly financail report given finance data and a date
 *
 * @param date The date to be analyzed
 * @param data The data to be used
 */
export function calculateMonthlyFinances(
    date: Date,
    data: IFinance
): MonthlyFinancialReport {
    // TODO: We need to take into account the different periods of incomes
    // for example, we must loop through all yearly incomes and find out if they fall on this month
    // I don't believe there is any need to check for monthly
    // For weekly we simply multiply by 3, 4 or 5 weeks depending on how many fell within this month
    // For bi-weekly, we need to determine how many of those weeks fell within our month. Likely just two, but check into this

    // The same must be done for expenses as well (Such as netflix, spotify, etc)

    const filteredItems: FinanceItem[] = [];
    for (let finance of data.finances) {
        const startDateCompare = compareDates(new Date(finance.start), date, {
            day: false,
            month: true,
            year: true,
        });
        if (startDateCompare > 0) continue; // If the finance started after the "date", ignore it

        if (finance.end != undefined) {
            const endDateCompare = compareDates(new Date(finance.end), date, {
                day: false,
                month: true,
                year: true,
            });

            if (endDateCompare < 0) continue; // If the finance ended in the past, ignore it
        }

        filteredItems.push(finance);
    }

    const theMap: Record<string, number> = {};
    for (let item of filteredItems.filter((x) => x.type == "EXPENSE")) {
        if (item.category in theMap) {
            theMap[item.category] += item.amount;
        } else {
            theMap[item.category] = item.amount;
        }
    }

    const income = filteredItems
        .filter((x) => x.type == "INCOME")
        .map((x) => x.amount)
        .reduce((a, b) => a + b, 0);
    const expense = filteredItems
        .filter((x) => x.type == "EXPENSE")
        .map((x) => x.amount)
        .reduce((a, b) => a + b, 0);
    return {
        gross: {
            income: income,
            expense: expense,
        },
        profit: income - expense,
        categoryMap: theMap,
    };
}

/**
 *
 * Generates a yearly financial report given finance data and a date
 *
 * @param date The date to be analyzed
 * @param data The data to be used
 */
export function calculateYearlyFinances(
    date: Date,
    data: IFinance
): YearlyFinancialReport {
    const mnthMap: Record<number, number> = {};

    let reports: MonthlyFinancialReport[] = [];
    for (let i = 0; i <= 12; i++) {
        let newDate = new Date(date.getFullYear(), i, 1);
        let financialReport = calculateMonthlyFinances(newDate, data);
        reports.push(financialReport);
        mnthMap[i] = financialReport.profit;
    }

    const totalIncome = reports
        .map((x) => x.gross.income)
        .reduce((a, b) => a + b);
    const totalExpenses = reports
        .map((x) => x.gross.expense)
        .reduce((a, b) => a + b);
    const catMap: Record<string, number> = {};
    for (let item of reports) {
        for (let key of Object.keys(item.categoryMap)) {
            if (key in catMap) {
                catMap[key] += item.categoryMap[key];
            } else {
                catMap[key] = item.categoryMap[key];
            }
        }
    }

    return {
        gross: {
            income: totalIncome,
            expense: totalExpenses,
        },
        profit: totalIncome - totalExpenses,
        categoryMap: catMap,
        monthMap: mnthMap,
    };
}

export interface MonthlyFinancialReport {
    gross: {
        income: number;
        expense: number;
    };
    profit: number;
    categoryMap: Record<string, number>;
}

export interface YearlyFinancialReport {
    gross: {
        income: number;
        expense: number;
    };
    profit: number;
    categoryMap: Record<string, number>;
    monthMap: Record<number, number>;
}
