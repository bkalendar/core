import { RecurrenceRule, Timetable, YearMonthDay } from "@/ast.ts";
import { DAY } from "std/datetime/constants.ts";
import { WEEK } from "std/datetime/mod.ts";

export function resolve(timetable: Timetable) {
	for (const timerow of timetable.rows) {
		if (timerow.recurrenceRule.type !== "raw") {
			throw new TypeError(`expected "raw" recurrence rule, got "${timerow.recurrenceRule.type}"`);
		}
		const r = rawToBased(timerow.recurrenceRule);
		if (!r) continue;
		timerow.recurrenceRule = basedToResolved(r, timerow.weekday, timetable.semester);
	}
}

function rawToBased(
	recurrence: RecurrenceRule & { type: "raw" },
): RecurrenceRule & { type: "based" } | null {
	// STEP 1: map index -> week

	const weeks: Map<number, number> = new Map();
	for (let index = 0; index < recurrence.weeks.length; index++) {
		const week = recurrence.weeks[index];
		if (week !== null) weeks.set(index, week);
	}

	if (weeks.size == 0) return null;

	// STEP 2: find base week and year boundary for classification

	let weekOfIndex0: number | undefined;
	let indexOfWeek1: number | undefined;

	for (const [index, week] of weeks.entries()) {
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

	return {
		type: "based",
		weekOfIndex0,
		indexOfWeek1,
		weeks: recurrence.weeks.map(Boolean),
	};
}

function basedToResolved(
	rrule: RecurrenceRule & { type: "based" },
	weekday: number,
	semester: number,
): RecurrenceRule {
	const year = 2000 + Math.trunc(semester / 10);
	semester = semester % 10;

	let dateOfIndex0: Date = new Date();

	// case 1: has a new year break, hence it span 2 years
	if (rrule.indexOfWeek1) {
		// start with new year
		let d = +new Date(year + 1, 0, 4);
		// offset new year into index 0 week
		d -= rrule.indexOfWeek1 * WEEK;
		// offset weekday
		d += (dayOfWeek(d) - weekday) * DAY;

		dateOfIndex0 = new Date(d);
	} // case 2: no new year break, semester 1 always starts early
	else if (semester == 1) {
		dateOfIndex0 = index0Starts("early");
	} // case 3: no new year break, semester 2 MAY start early
	else if (semester == 2) {
		dateOfIndex0 = index0Starts(rrule.weekOfIndex0! >= 26 ? "early" : "late");
	} // case 4: no new year break, semester 3 always starts late
	else if (semester == 3) {
		dateOfIndex0 = index0Starts("late");
	}

	function index0Starts(type: "early" | "late") {
		// start with new year
		let d = +new Date(type == "early" ? year : year + 1, 0, 4);
		// offset new year into index 0 week
		d += (rrule.weekOfIndex0! - 1) * WEEK;
		// offset weekday
		d += (dayOfWeek(d) - weekday) * DAY;

		return new Date(d);
	}

	let start: YearMonthDay | undefined;
	let end: YearMonthDay | undefined;
	const excludes: YearMonthDay[] = [];
	for (let i = 0; i < rrule.weeks.length; i++) {
		const date = new Date(+dateOfIndex0 + i * WEEK);
		const ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate()] satisfies YearMonthDay;

		if (rrule.weeks[i]) {
			start ??= ymd;
			end = ymd;
		} else {
			excludes.push(ymd);
		}
	}

	return {
		type: "resolved",
		start: start!,
		end: end!,
		excludes,
	};
}

function dayOfWeek(d: number): number {
	return (new Date(d).getDay() + 6) % 7 + 2;
}
