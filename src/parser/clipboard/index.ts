import type { Timetable } from "../index.ts";
import { parseTimerow } from "./timerow.ts";

const regex =
	/Học kỳ (?<semester>\d) Năm học (?<yearFrom>\d+) - (?<yearTo>\d+)\n[^\n]*\n[^\n]*\n(?<entries>(?:[^](?!Tổng số tín chỉ đăng ký))*)/g;

export function parse(raw: string): Timetable[] {
	const timetables: Timetable[] = [];
	for (const match of raw.matchAll(regex)) {
		const semester = {
			semester: parseInt(match.groups!.semester),
			year: parseInt(match.groups!.yearFrom),
		};
		const timerows = match
			.groups!.entries.split("\n")
			.map((rawTimerow) => parseTimerow(rawTimerow.trim()));

		timetables.push({
			timerows,
			semester,
		});
	}
	return timetables;
}
