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
