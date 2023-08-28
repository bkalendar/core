import { Timerow } from "@/timetable.ts";
import { ASIA_HO_CHI_MINH, dateOfIndex, formatHCM, formatUTC } from "@/formatter/utils.ts";
import { Timetable } from "@/timetable.ts";

const TIME_ZONE = "Asia/Ho_Chi_Minh";

/**
 * transform calendar into ical format
 * @returns rfc5545 compilant ical calendar
 */
export function formatIcal(timetable: Required<Timetable>): string {
	const arr = [
		"BEGIN:VCALENDAR",
		"PRODID:-//bkalendar//BKalendar//VI",
		"VERSION:2.0",
		// below is vtimezone component
		// taken from: https://github.com/touch4it/ical-timezones/blob/master/lib/zones/Asia/Ho_Chi_Minh.ics
		"BEGIN:VTIMEZONE",
		"TZID:Asia/Ho_Chi_Minh",
		"TZURL:http://tzurl.org/zoneinfo-outlook/Asia/Ho_Chi_Minh",
		"X-LIC-LOCATION:Asia/Ho_Chi_Minh",
		"BEGIN:STANDARD",
		"TZOFFSETFROM:+0700",
		"TZOFFSETTO:+0700",
		"TZNAME:+07",
		"DTSTART:19700101T000000",
		"END:STANDARD",
		"END:VTIMEZONE",
	];

	for (const timerow of timetable.rows) {
		if (isNaN(timerow.weekday) || timerow.weeks.length == 0) {
			continue;
		}
		arr.push(...formatTimerow(timerow, timetable.startMondayUTC));
	}

	arr.push("END:VCALENDAR");
	return arr.join("\r\n");
}

function formatTimerow(tr: Timerow, startMondayUTC: Date) {
	const start = tr.weeks.findIndex(Boolean);
	const recurrence = icalRrule(tr, startMondayUTC);
	return [
		"BEGIN:VEVENT",
		`UID:${crypto.randomUUID()}@bkalendar`,
		`DTSTAMP:${formatUTC(new Date())}`,
		// info
		`SUMMARY:${tr.name}`,
		`DESCRIPTION:${Object.entries(tr.extras).map((e) => e.join(": ")).join("\n")}`,
		`LOCATION:${tr.location}`,
		// time
		`DTSTART;TZID=${TIME_ZONE}:${
			formatHCM(dateOfIndex(start, tr.startHm, startMondayUTC, tr.weekday))
		}`,
		`DTEND;TZID=${TIME_ZONE}:${
			formatHCM(dateOfIndex(start, tr.endHm, startMondayUTC, tr.weekday))
		}`,
		...recurrence,
		"END:VEVENT",
	];
}

/**
 * generate rrule with UNTIL and EXDATE rule
 */
export function icalRrule(
	{ weekday, startHm, weeks }: Timerow,
	startMondayUTC: Date,
): string[] {
	const start = weeks.findIndex(Boolean);
	const end = weeks.findIndex(Boolean);

	// if only one event, no rrule needed
	if (start == end) {
		return [];
	}
	// UNTIL only accepts utc datetime...
	const rrules: string[] = [
		`RRULE:FREQ=WEEKLY;UNTIL=${formatUTC(dateOfIndex(end, startHm, startMondayUTC, weekday))}`,
	];

	const excludes = [];
	for (let i = start; i <= end; i++) {
		if (!weeks[i]) {
			excludes.push(i);
		}
	}
	if (excludes.length != 0) {
		rrules.push(
			`EXDATE;TZID=${ASIA_HO_CHI_MINH}:${
				excludes.map((ex) => formatHCM(dateOfIndex(ex, startHm, startMondayUTC, weekday))).join(",")
			}`,
		);
	}
	return rrules;
}
