import { format, formatISO } from "date-fns";
import type { Timetable } from "../../parser/json";
import { transformTime } from "../time";

type EventInput = gapi.client.calendar.EventInput;

export const TIME_ZONE = "Asia/Ho_Chi_Minh";

export function transform({ timerows, semester }: Timetable): EventInput[] {
	const events = [];
	for (const timerow of timerows) {
		const transformed = transformTime(timerow.time, semester);
		if (transformed === null) continue;

		const { start, end, until, exceptions } = transformed;

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
