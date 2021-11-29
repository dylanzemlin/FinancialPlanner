function compareNums(num1: number, num2: number) {
	return num1 - num2;
}

function ensureCompare(...values: number[]) {
	if (values.reduce((a, b) => a + b) == 0) {
		return 0;
	}

	let max = Math.max(...values);
	let min = Math.min(...values);

	if (min <= -1) {
		return -1;
	}

	return max;
}

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
	compare: {
		day: boolean;
		month: boolean;
		year: boolean;
	}
): number {
	if (isNaN(thisDate?.getTime()) || isNaN(thatDate?.getTime())) {
		throw new Error("Invalid date object passed into compareDates");
	}

	const yearCompare = compareNums(
		thisDate.getFullYear(),
		thatDate.getFullYear()
	);
	const monthCompare = compareNums(thisDate.getMonth(), thatDate.getMonth());
	const dayCompare = compareNums(thisDate.getDate(), thatDate.getDate());

	if (compare.year && compare.month && compare.day) {
		return ensureCompare(yearCompare, monthCompare, dayCompare);
	}

	if (compare.year && compare.month) {
		return ensureCompare(yearCompare, monthCompare);
	}

	if (compare.year && compare.day) {
		return ensureCompare(yearCompare, dayCompare);
	}

	if (compare.month && compare.day) {
		return ensureCompare(monthCompare, dayCompare);
	}

	if (compare.year) return yearCompare;
	if (compare.month) return monthCompare;
	if (compare.day) return dayCompare;

	return -1;
}
