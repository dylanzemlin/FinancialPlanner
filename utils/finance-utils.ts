import { FinanceItem, IFinance } from "../models/finance";
import { compareDates } from "./date-utils";

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
    for(let i = 0; i <= 12; i++) {
        let newDate = new Date(date.getFullYear(), i, 1);
        let financialReport = calculateMonthlyFinances(newDate, data);
        reports.push(financialReport);
        mnthMap[i] = financialReport.profit;
    }

    const totalIncome = reports.map(x => x.gross.income).reduce((a, b) => a + b);
    const totalExpenses = reports.map(x => x.gross.expense).reduce((a, b) => a + b);
    const catMap: Record<string, number> = {};
    for (let item of reports) {
        for(let key of Object.keys(item.categoryMap)) {
            if(key in catMap) {
                catMap[key] += item.categoryMap[key];
            } else {
                catMap[key] = item.categoryMap[key];
            }
        }
	}

    return {
        gross: {
            income: totalIncome,
            expense: totalExpenses
        },
        profit: totalIncome - totalExpenses,
        categoryMap: catMap,
        monthMap: mnthMap
    }
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