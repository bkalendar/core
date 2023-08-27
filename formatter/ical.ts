import { ResolvedTimerow, ResolvedTimetable, Timerow } from "@/ast.ts";
import { HOUR } from "std/datetime/constants.ts";
import { format } from "std/datetime/format.ts";

const TIME_ZONE = "Asia/Ho_Chi_Minh";
const OFFSET = +7;

/**
 * transform calendar into ical format
 * @returns rfc5545 compilant ical calendar
 */
export function formatIcal(timetable: ResolvedTimetable): string {
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
		arr.push(...formatTimerow(timerow));
	}

	arr.push("END:VCALENDAR");
	return arr.join("\r\n");
}

function formatTimerow(timerow: ResolvedTimerow) {
	const recurrence = icalRrule(timerow);
	return [
		"BEGIN:VEVENT",
		`UID:${crypto.randomUUID()}@bkalendar`,
		`DTSTAMP:${icalUTCDate(new Date())}`,
		// info
		`SUMMARY:${timerow.name}`,
		`DESCRIPTION:${Object.entries(timerow.extras).map((e) => e.join(": ")).join("\n")}`,
		`LOCATION:${timerow.location}`,
		// time
		`DTSTART;TZID=${TIME_ZONE}:${
			icalFloatingDate(new Date(...timerow.recurrenceRule.start, ...timerow.startHm))
		}`,
		`DTEND;TZID=${TIME_ZONE}:${
			icalFloatingDate(new Date(...timerow.recurrenceRule.start, ...timerow.endHm))
		}`,
		...recurrence,
		"END:VEVENT",
	];
}

/**
 * RFC5545 compiliant floating datetime
 * see: https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5
 */
export function icalFloatingDate(date: Date) {
	return `${format(date, "yyyyMMdd'T'HHmmss")}`;
}

/**
 * RFC5545 compiliant utc datetime
 * see: https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5
 */
export function icalUTCDate(date: Date) {
	date = new Date(+date - OFFSET * HOUR);
	return `${format(date, "yyyyMMdd'T'HHmmss'Z'")}`;
}

/**
 * generate rrule with UNTIL and EXDATE rule
 */
export function icalRrule(
	{ startHm, recurrenceRule: { start, end, excludes } }: ResolvedTimerow,
): string[] {
	// if only one event, no rrule needed
	if (start[0] == end[0] && start[1] == end[1] && start[2] == end[2]) {
		return [];
	}
	// UNTIL only accepts utc datetime...
	const rrules: string[] = [
		`RRULE:FREQ=WEEKLY;UNTIL=${icalUTCDate(new Date(...end, ...startHm))}`,
	];
	if (excludes.length != 0) {
		rrules.push(
			`EXDATE;TZID=${TIME_ZONE}:${
				excludes.map((e) => icalFloatingDate(new Date(...e, ...startHm))).join(",")
			}`,
		);
	}
	return rrules;
}
