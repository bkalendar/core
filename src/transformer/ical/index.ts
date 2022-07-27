import { addMinutes, format } from "date-fns";
import type { Semester, Timerow, Timetable } from "../../parser";
import { transformTime } from "../time";
import { nanoid } from "nanoid";

const TIME_ZONE = "Asia/Ho_Chi_Minh";

/**
 * transform calendar into ical format
 * @returns rfc5545 compilant ical calendar
 */
export function transform({ timerows, semester }: Timetable): string {
	let arr = [
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

	for (const timerow of timerows) {
		const transformed = transformTimerow(timerow, semester);
		if (transformed) arr.push(transformed);
	}

	arr.push("END:VCALENDAR");
	return arr.join("\r\n");

	function transformTimerow(timerow: Timerow, semester: Semester) {
		const transformed = transformTime(timerow.time, semester);
		if (transformed === null) return null;

		const { start, end, until, exceptions } = transformed;
		// if only one week span, no need for rrule
		const recurrence = +start == +until ? [] : rrule(until, exceptions);

		return [
			"BEGIN:VEVENT",
			`UID:${nanoid()}@bkalendar`,
			`DTSTAMP:${icalUTCDate(new Date())}`,
			// info
			`SUMMARY:${timerow.info.course} - ${timerow.info.name}`,
			`DESCRIPTION:${JSON.stringify(timerow.info)}`,
			`LOCATION:${timerow.location.room}`,
			// time
			`DTSTART;TZID=${TIME_ZONE}:${icalFloatingDate(start)}`,
			`DTEND;TZID=${TIME_ZONE}:${icalFloatingDate(end)}`,
			...recurrence,
			"END:VEVENT",
		].join("\r\n");
	}
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
	// see https://github.com/date-fns/date-fns/issues/1401
	const utc = addMinutes(date, date.getTimezoneOffset());
	return `${format(utc, "yyyyMMdd'T'HHmmss'Z'")}`;
}

/**
 * generate rrule with UNTIL and EXDATE rule
 */
export function rrule(until: Date, exceptions: Date[]): string[] {
	// UNTIL only accepts utc datetime...
	const rrules: string[] = [`RRULE:FREQ=WEEKLY;UNTIL=${icalUTCDate(until)}`];
	if (exceptions.length != 0) {
		rrules.push(`EXDATE;TZID=${TIME_ZONE}:${exceptions.map(icalFloatingDate).join(",")}`);
	}
	return rrules;
}
