import { icalRrule } from "@/formatter/ical.ts";
import type { Timetable } from "@/timetable.ts";
import { ASIA_HO_CHI_MINH, dateOfIndex } from "@/formatter/utils.ts";
import { isUnresolvable } from "@/resolver.ts";

type Event = {
	summary: string;
	description: string;
	location: string;
	start: {
		dateTime: string;
		timeZone: string;
	};
	end: {
		dateTime: string;
		timeZone: string;
	};
	recurrence: string[];
};

export function formatGapi(timetable: Required<Timetable>): Event[] {
	const events = [];
	for (const timerow of timetable.rows) {
		if (isUnresolvable(timerow)) {
			continue;
		}

		const start = timerow.weeks.findIndex(Boolean);
		const recurrence = icalRrule(timerow, timetable.startMondayUTC);
		const event = {
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
		} satisfies Event;
		events.push(event);
	}
	return events;
}
