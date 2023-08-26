import { add } from "date-fns";
import type { Semester, Timerow } from "../../parser/index.ts";
import { calcBase } from "../../refine/calcBase.ts";

/**
 * transform human readable datetime into machine readable datetime
 * @param time human hours, minutes, weeks, ...
 * @param semester e.g HK203
 * @returns `time` but transformed into `Date`
 */
export function transformTime(
	time: Timerow["time"],
	semester: Semester,
): { start: Date; end: Date; until: Date; exceptions: Date[] } | null {
	// some timerow doesn't have weeks or weekday
	// in this case we can do nothing about it
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
