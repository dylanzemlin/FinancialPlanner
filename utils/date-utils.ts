import { IFinance } from '../models/finance';
import Moment from 'moment';

// Straight from Moment
export type Base = (
    "year" | "years" | "y" |
    "month" | "months" | "M" |
    "week" | "weeks" | "w" |
    "day" | "days" | "d" |
    "hour" | "hours" | "h" |
    "minute" | "minutes" | "m" |
    "second" | "seconds" | "s" |
    "millisecond" | "milliseconds" | "ms"
);

/**
 *
 * Determines if "this" date is later than "that" date
 *
 * @param thisDate The "this" date
 * @param thatDate The "that" date
 */
export function compareDates(
	thisDate: Date,
	thatDate: Date,
    compare: Base
): number {
	if (isNaN(thisDate?.getTime()) || isNaN(thatDate?.getTime())) {
		throw new Error("Invalid date object passed into compareDates");
	}

	const thisMoment = Moment(thisDate);
    const thatMoment = Moment(thatDate);

    if(thisMoment.isAfter(thatMoment, compare)) return 1;
    if(thisMoment.isBefore(thatMoment, compare)) return -1;

	return 0;
}

/**
 * 
 * Determines the earliest date in a group of finance data
 * 
 * @param finance The finance data
 * @param year The year to check
 * @returns The earliest data
 */
export function getEarliestFinanceDateForYear(finance: IFinance, year: number): Date {

    let moment = Moment();

    for(let item of finance.finances) {
        if(Moment(item.start).isSameOrBefore(moment, 'month') && Moment(year, 'YYYY').isSame(item.start, 'year')) {
            moment = Moment(item.start);
        }
    }

    return moment.toDate();

}

/**
 * 
 * Determines the earliest year in a group of finance data
 * 
 * @param finance The finance data
 * @returns The earliest year
 */
export function getEarliestFinanceYear(finance: IFinance): number {

    let minYear = new Date().getFullYear();

    for(let item of finance.finances) {
        if(new Date(item.start).getFullYear() < minYear) {
            minYear = new Date(item.start).getFullYear();
        }
    }

    return minYear;

}