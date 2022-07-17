import { add, format, formatISO } from "date-fns";
import type { Timetable } from "../../parser";
import { calcBase } from "../../utils/calcBase";

type EventInput = gapi.client.calendar.EventInput;

export const TIME_ZONE = "Asia/Ho_Chi_Minh";

export function transform({ timerows, semester }: Timetable): EventInput[] {
	const events = [];
	for (const timerow of timerows) {
		if (timerow.time.weeks === null || timerow.time.weekday === 0) continue;

		const base = calcBase(timerow.time.weeks, semester);

		// pls don't judge me
		const start = add(base, {
			weeks: timerow.time.weeks.from,
			days: timerow.time.weekday - 2,
			hours: timerow.time.startAt.hour,
			minutes: timerow.time.startAt.minute,
		});
		const end = add(base, {
			weeks: timerow.time.weeks.from,
			days: timerow.time.weekday - 2,
			hours: timerow.time.endAt.hour,
			minutes: timerow.time.endAt.minute,
		});
		const until = add(base, {
			weeks: timerow.time.weeks.until,
			days: timerow.time.weekday - 2,
			hours: timerow.time.startAt.hour,
			minutes: timerow.time.startAt.minute,
		});
		const exceptions = timerow.time.weeks.exceptions.map((exception) =>
			add(base, {
				weeks: exception,
				days: timerow.time.weekday - 2,
				hours: timerow.time.startAt.hour,
				minutes: timerow.time.startAt.minute,
			})
		);

		const event: EventInput = {
			summary: `${timerow.info.course} - ${timerow.info.name}`,
			location: timerow.location.room,
			description: JSON.stringify(timerow.info),
			start: {
				dateTime: formatISO(start),
				timeZone: TIME_ZONE,
			},
			end: {
				dateTime: formatISO(end),
				timeZone: TIME_ZONE,
			},
			recurrence: [
				exceptions.length !== 0
					? `EXDATE;VALUE=DATETIME:${exceptions.map(icalDate).join(",")}`
					: "",
				`RRULE:FREQ=WEEKLY;UNTIL=${icalDate(until)}`,
			].filter(Boolean),
		};
		events.push(event);
	}
	return events;
}

function icalDate(date: Date) {
	return `TZID=${TIME_ZONE}:${format(date, "yyyyMMdd'T'HHmmss")}`;
}
