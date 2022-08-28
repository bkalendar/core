import { formatISO } from "date-fns";
import { rrule } from "./ical.js";
import type { MachineTimetable } from "./index.js";
import { transformInfoBasic } from "./info.js";

type EventInput = gapi.client.calendar.EventInput;

const TIME_ZONE = "Asia/Ho_Chi_Minh";

export function transform(
	{ timerows }: MachineTimetable,
	options?: { infoTransformer?: typeof transformInfoBasic }
): EventInput[] {
	let infoTransformer = options?.infoTransformer ?? transformInfoBasic;

	const events = [];
	for (const timerow of timerows) {
		if (!timerow.time) continue;
		const { start, end, until, exceptions } = timerow.time;
		const recurrence = rrule(until, exceptions);

		const { summary, description } = infoTransformer(timerow.info);

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
