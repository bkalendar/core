import { icalRrule } from "@/formatter/ical.ts";
import gapi from "gapi.calendar";
import { Timetable } from "@/timetable.ts";
import { ASIA_HO_CHI_MINH, dateOfIndex } from "@/formatter/utils.ts";

type EventInput = gapi.client.calendar.EventInput;

export function formatGapi(timetable: Required<Timetable>): EventInput[] {
	const events = [];
	for (const timerow of timetable.rows) {
		if (isNaN(timerow.weekday) || timerow.weeks.length == 0) {
			continue;
		}

		const start = timerow.weeks.findIndex(Boolean);
		const recurrence = icalRrule(timerow, timetable.startMondayUTC);
		const event: EventInput = {
			summary: timerow.name,
			description: Object.entries(timerow.extras).map((e) => e.join(": ")).join("\n"),
			location: timerow.location,
			start: {
				dateTime: dateOfIndex(start, timerow.startHm, timetable.startMondayUTC, timerow.weekday)
					.toISOString(),
				timeZone: ASIA_HO_CHI_MINH,
			},
			end: {
				dateTime: dateOfIndex(start, timerow.endHm, timetable.startMondayUTC, timerow.weekday)
					.toISOString(),
				timeZone: ASIA_HO_CHI_MINH,
			},
			recurrence,
		};
		events.push(event);
	}
	return events;
}
