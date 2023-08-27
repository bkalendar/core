import { RecurrenceRule, Timetable, YearMonthDay } from "@/ast.ts";
import { DAY } from "std/datetime/constants.ts";
import { WEEK } from "std/datetime/mod.ts";

export function resolve(timetable: Timetable): Timetable {
	const newTimetable: Timetable = {
		semester: timetable.semester,
		rows: [],
	};
	let commonMondayOfIndex0: Date | undefined;
	for (const timerow of timetable.rows) {
		if (timerow.recurrenceRule.type !== "raw") {
			throw new TypeError(`expected "raw" recurrence rule, got "${timerow.recurrenceRule.type}"`);
		}
		if (isNaN(timerow.weekday) || timerow.recurrenceRule.weeks.length == 0) {
			continue;
		}
		const newTimerow = structuredClone(timerow);
		newTimerow.recurrenceRule = resolveRecurrenceRule(
			timerow.recurrenceRule,
			timetable.semester,
			timerow.weekday,
		);
		const mondayOfIndex0 = new Date(
			+newTimerow.recurrenceRule.dateOfIndex0 - (newTimerow.weekday - 2) * DAY,
		);
		commonMondayOfIndex0 ??= mondayOfIndex0;
		if (+commonMondayOfIndex0 != +mondayOfIndex0) {
			throw new MixedSemesterError(commonMondayOfIndex0!, mondayOfIndex0);
		}
		newTimetable.rows.push(newTimerow);
	}
	return newTimetable;
}

export class MixedSemesterError extends Error {
	constructor(public doiz1: Date, public doiz2: Date) {
		super(
			`Semester ambiguity: Two possible semester start dates: ${doiz1.toISOString()} and ${doiz2.toISOString()}`,
		);
	}
}

function resolveRecurrenceRule(
	rrule: RecurrenceRule & { type: "raw" },
	semester: number,
	weekday: number,
): RecurrenceRule & { type: "resolved"; dateOfIndex0: Date } {
	const { indexOfWeek1, weekOfIndex0 } = findIndex0AndWeek1(rrule.weeks);
	const dateOfIndex0 = findDateOfIndex0(indexOfWeek1, weekOfIndex0, semester, weekday);

	const startIndex: number = rrule.weeks.findIndex(Boolean);
	const endIndex: number = rrule.weeks.findLastIndex(Boolean);

	return {
		type: "resolved",
		dateOfIndex0,
		start: indexToDate(startIndex),
		end: indexToDate(endIndex),
		excludes: rrule.weeks.slice(startIndex, endIndex + 1)
			.filter((w) => w === null)
			.map((_, i) => indexToDate(i)),
	};

	function indexToDate(i: number) {
		const date = new Date(+dateOfIndex0 + i * WEEK);
		const ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate()] satisfies YearMonthDay;
		return ymd;
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
 * ```
 *
 * ```
 * --|33|--|--|--|--|38|--
 * ^^ weekOfIndex0=32
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

function findDateOfIndex0(
	indexOfWeek1: number | undefined,
	weekOfIndex0: number | undefined,
	semester: number,
	weekday: number,
) {
	const year = 2000 + Math.trunc(semester / 10);

	if (indexOfWeek1) { // has a new year break, hence it span 2 years
		// start with new year
		let d = +new Date(year + 1, 0, 4);
		// offset new year into index 0 week
		d -= indexOfWeek1 * WEEK;
		// offset weekday
		d += (weekday - dayOfWeek(d)) * DAY;

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
		let d = +new Date(type == "early" ? year : year + 1, 0, 4);
		// offset new year into index 0 week
		d += (weekOfIndex0! - 1) * WEEK;
		// offset weekday
		d += (weekday - dayOfWeek(d)) * DAY;

		return new Date(d);
	}
}

function dayOfWeek(d: number): number {
	return (new Date(d).getDay() + 6) % 7 + 2;
}
