import { RecurrenceRule, Timetable } from "@/ast.ts";

export function resolve(timetable: Timetable) {
	for (const timerow of timetable.rows) {
		const r = rawToBased(timerow.recurrenceRule);
		if (!r) continue;
		timerow.recurrenceRule = r;
	}
}

function rawToBased(recurrence: RecurrenceRule): RecurrenceRule | null {
	if (recurrence.type !== "raw") throw new TypeError(`expected "raw" recurrence rule, got "${recurrence.type}"`);

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
