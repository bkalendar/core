import { add } from "date-fns";
import type { Semester, Timerow } from "../parser/json";
import { calcBase } from "./calcBase";

export function transformTime(time: Timerow["time"], semester: Semester) {
	if (time.weeks === null || time.weekday === 0) return null;

	const base = calcBase(time.weeks, semester);

	// pls don't judge me
	const start = add(base, {
		weeks: time.weeks.from,
		days: time.weekday - 2,
		hours: time.startAt.hour,
		minutes: time.startAt.minute,
	});
	const end = add(base, {
		weeks: time.weeks.from,
		days: time.weekday - 2,
		hours: time.endAt.hour,
		minutes: time.endAt.minute,
	});
	const until = add(base, {
		weeks: time.weeks.until,
		days: time.weekday - 2,
		hours: time.startAt.hour,
		minutes: time.startAt.minute,
	});
	const exceptions = time.weeks.exceptions.map((exception) =>
		add(base, {
			weeks: exception,
			days: time.weekday - 2,
			hours: time.startAt.hour,
			minutes: time.startAt.minute,
		})
	);

	return { start, end, until, exceptions };
}
