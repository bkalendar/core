import { icalRrule } from "@/formatter/ical.ts";
import gapi from "gapi.calendar";
import { ResolvedTimetable } from "@/ast.ts";

type EventInput = gapi.client.calendar.EventInput;

const TIME_ZONE = "Asia/Ho_Chi_Minh";

export function formatGapi(timetable: ResolvedTimetable): EventInput[] {
	const events = [];
	for (const timerow of timetable.rows) {
		const recurrence = icalRrule(timerow);

		const event: EventInput = {
			summary: timerow.name,
			description: Object.entries(timerow.extras).map((e) => e.join(": ")).join("\n"),
			location: timerow.location,
			start: {
				dateTime: new Date(...timerow.recurrenceRule.start, ...timerow.startHm).toISOString(),
				timeZone: TIME_ZONE,
			},
			end: {
				dateTime: new Date(...timerow.recurrenceRule.start, ...timerow.endHm).toISOString(),
				timeZone: TIME_ZONE,
			},
			recurrence,
		};
		events.push(event);
	}
	return events;
}
