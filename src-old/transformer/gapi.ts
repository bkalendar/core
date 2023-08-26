import { formatISO } from "date-fns";
import { rrule } from "./ical.ts";
import type { MachineTimetable } from "./index.ts";
import { transformInfoBasic } from "./info.ts";
import gapi from "gapi.calendar";

type EventInput = gapi.client.calendar.EventInput;

const TIME_ZONE = "Asia/Ho_Chi_Minh";

export function transform({ timerows }: MachineTimetable): EventInput[] {
	const events = [];
	for (const timerow of timerows) {
		if (!timerow.time) continue;
		const { start, end, until, exceptions } = timerow.time;
		const recurrence = rrule(until, exceptions);

		const { summary, description } = transformInfoBasic(timerow.info);

		const event: EventInput = {
			summary,
			description,
			location: timerow.location.room,
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
