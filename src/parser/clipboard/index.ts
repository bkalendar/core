import type { Timetable } from "../json";
import { parseTimerow } from "./timerow";

const regex =
	/Học kỳ (?<semester>\d) Năm học (?<yearFrom>\d+) - (?<yearTo>\d+)\n[^\n]*\n[^\n]*\n(?<entries>(?:[^](?!Tổng số tín chỉ đăng ký))*)/g;
export function parse(raw: string) {
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
