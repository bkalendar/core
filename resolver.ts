import type { Timerow, Timetable } from "@/timetable.ts";
import { DAY, WEEK } from "@std/datetime";

export function resolve(timetable: Timetable): asserts timetable is Required<Timetable> {
	// already resolved
	if (timetable.startMondayUTC) return;

	for (const timerow of timetable.rows) {
		if (isUnresolvable(timerow)) {
			continue;
		}
		const { indexOfWeek1, weekOfIndex0 } = findIndex0AndWeek1(timerow.weeks);
		const mondayOfIndex0 = findMondayOfIndex0(indexOfWeek1, weekOfIndex0, timetable.semester);
		timetable.startMondayUTC ??= mondayOfIndex0;
		if (+timetable.startMondayUTC != +mondayOfIndex0) {
			throw new MixedSemesterError(timetable.startMondayUTC, mondayOfIndex0);
		}
	}

	// if calendar contains no resolvable timerow
	if (!timetable.startMondayUTC) {
		throw new UnresolvedError();
	}
}

export function isUnresolvable(timerow: Timerow): boolean {
	return isNaN(timerow.weekday) || timerow.weeks.length == 0 ||
		(timerow.weeks.length == 1 && timerow.weeks[0] == null);
}

export class MixedSemesterError extends Error {
	constructor(public doiz1: Date, public doiz2: Date) {
		super(
			`Semester ambiguity: Two possible semester start dates: ${doiz1.toISOString()} and ${doiz2.toISOString()}`,
		);
	}
}

export class UnresolvedError extends Error {
	constructor() {
		super(`Calendar cannot be resolved`);
	}
}

/**
 * Find week 1 and index 0 for semester to year conversion.
 *
 * For example:
 *
 * ```
 * --|--|--|--|02|--|--|--
 *          ^^ we know week 01 should be here, so indexOfWeek1=3
 * ^^ we don't know the week at index 0
 * ```
 *
 * ```
 * --|33|--|--|--|--|38|--
 * ^^ we know week 32 should be at index 0, so weekOfIndex0=32
 * ```
 *
 * ```
 * --|--|49|--|--|--|--|--|--|03
 * ^^ weekOfIndex0=47   ^^ indexOfWeek1=7
 * ```
 */
function findIndex0AndWeek1(weeks: (number | null)[]) {
	let weekOfIndex0: number | undefined;
	let indexOfWeek1: number | undefined;

	for (const [index, week] of weeks.entries()) {
		if (week == null) continue;

		// for example, week 2 at index 2 means new year's at index 1
		if (week - index <= 0) {
			indexOfWeek1 = index - week + 1;
			break;
		}

		// else, initialize base week
		if (!weekOfIndex0) {
			weekOfIndex0 = week - index;
		}
	}
	return { weekOfIndex0, indexOfWeek1 };
}

function findMondayOfIndex0(
	indexOfWeek1: number | undefined,
	weekOfIndex0: number | undefined,
	semester: number,
) {
	const year = 2000 + Math.trunc(semester / 10);

	if (indexOfWeek1) { // has a new year break, hence it span 2 years
		// start with new year
		let d = +Date.UTC(year + 1, 0, 4);
		// offset new year into index 0 week
		d -= indexOfWeek1 * WEEK;
		// offset weekday
		d -= (dayOfWeek(d) - 2) * DAY;

		return new Date(d);
	}

	switch (semester % 10) {
		case 1: // no new year break, semester 1 always starts early
			return index0Starts("early");
		case 2: // no new year break, semester 2 MAY start early
			return index0Starts(weekOfIndex0! >= 26 ? "early" : "late");
		case 3: // no new year break, semester 3 always starts late
			return index0Starts("late");
		default:
			throw new Error("unreachable");
	}

	function index0Starts(type: "early" | "late") {
		// start with new year
		let d = +Date.UTC(type == "early" ? year : year + 1, 0, 4);
		// offset new year into index 0 week
		d += (weekOfIndex0! - 1) * WEEK;
		// offset weekday
		d -= (dayOfWeek(d) - 2) * DAY;

		return new Date(d);
	}
}

function dayOfWeek(d: number): number {
	return (new Date(d).getDay() + 6) % 7 + 2;
}
