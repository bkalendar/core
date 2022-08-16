import { formatISO } from "date-fns";
import { rrule } from "../ical/index.js";
import type { MachineTimetable } from "../index.js";

type EventInput = gapi.client.calendar.EventInput;

const TIME_ZONE = "Asia/Ho_Chi_Minh";

export function transform({ timerows }: MachineTimetable): EventInput[] {
	const events = [];
	for (const timerow of timerows) {
		if (!timerow.time) continue;
		const { start, end, until, exceptions } = timerow.time;
		const recurrence = rrule(until, exceptions);

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
			recurrence,
		};
		events.push(event);
	}
	return events;
}
