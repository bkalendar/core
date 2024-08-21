import { DAY, HOUR, MINUTE, WEEK } from "@std/datetime";

export const ASIA_HO_CHI_MINH = "Asia/Ho_Chi_Minh";

const utcFormatter = new Intl.DateTimeFormat("vi-VN", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
	timeZone: "UTC",
});
const hcmFormatter = new Intl.DateTimeFormat("vi-VN", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
	timeZone: ASIA_HO_CHI_MINH,
});

export function dateOfIndex(
	i: number,
	hm: [number, number],
	startMondayUTC: Date,
	weekday: number,
): Date {
	// hm is in GMT+7
	return new Date(
		+startMondayUTC + i * WEEK + (weekday - 2) * DAY + (hm[0] - 7) * HOUR + hm[1] * MINUTE,
	);
}

/**
 * RFC5545 compiliant utc datetime
 *
 * see: https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5
 */
export function formatUTC(d: Date) {
	const parts: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {};
	for (const part of utcFormatter.formatToParts(d)) {
		parts[part.type] = part.value;
	}
	return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}Z`;
}

/**
 * RFC5545 compiliant floating datetime
 *
 * see: https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5
 */
export function formatHCM(d: Date) {
	const parts: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {};
	for (const part of hcmFormatter.formatToParts(d)) {
		parts[part.type] = part.value;
	}
	return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}`;
}
