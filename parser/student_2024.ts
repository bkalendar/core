import {
	NumOfColumnMismatchError,
	ParseError,
	SemesterNotFoundError,
	TableNotFoundError,
} from "@/parser/errors.ts";
import type { Timerow, Timetable } from "@/timetable.ts";
import { parseTime } from "@/parser/utils.ts";

const HEADER =
	"học kỳ\tmã mh\ttên môn học\ttín chỉ\ttc học phí\tnhóm - tổ\tthứ\ttiết\tgiờ học\tphòng\tcơ sở\ttuần học"
		.normalize("NFD");
const COLS = HEADER.split("\t").length;

export function parseStudent2024(src: string): Timetable {
	src = src.trim();
	const lines = src.split("\n");
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim().normalize("NFD").toLowerCase() == HEADER) {
			return parseFromHeader(lines, i);
		}
	}
	throw new TableNotFoundError(src);
}

function parseFromHeader(lines: string[], i: number): Timetable {
	// from the header, go back 6 lines and extract the semester
	let matches;
	for (let j = 6; j >= 0 && !matches; j--) {
		matches = lines[i - j]?.match(/Học kỳ ([123]) Năm học (\d+) - (\d+)/);
	}
	if (!matches) {
		throw new SemesterNotFoundError(lines[i - 6]);
	}
	// "Học kỳ 2 năm học 2023 - ..." should yield semester=232
	const semester = (Number(matches[2]) % 100) * 10 + Number(matches[1]);

	const rows = [];
	i++;
	for (; i < lines.length; i++) {
		if (lines[i].startsWith("Trình bày từ dòng")) break;

		// a sample timerow:
		// (-1)     (0)       (1)       (2)(3) (4) (5)  (6)        (7)        (8)     (9)                     (10)
		// 20232..CH1003..Hóa đại cương..3..3..L14..6..10-12..15:00 - 17:50..H2-301..BK-CS2..--|09|10|11|12|13|14|15|16|--|18|19|
		const cols = lines[i].split("\t");
		if (cols.length != COLS) {
			throw new NumOfColumnMismatchError(lines[i], COLS, cols.length);
		}
		let weekday: number;
		if (cols[6] == "CN") {
			weekday = 8;
		} else {
			weekday = Number(cols[6]);
		}
		if (cols[8] === "--") {
			continue;
		}
		const times = cols[8].split(" - ");
		if (times.length != 2) {
			throw new ParseError(cols[7], `Time column is not separated by " - "`);
		}
		const startHm = parseTime(times[0]);
		const endHm = parseTime(times[1]);
		// trim the trailing '|'
		const weeks = cols[11].slice(0, -1).split("|").map((s) => s == "--" ? null : Number(s));

		const row = {
			name: cols[2],
			weekday,
			startHm,
			endHm,
			weeks,
			location: cols[9],
			extras: {
				"mã môn học": cols[1],
				"tín chỉ": cols[3],
				"tín chỉ học phí": cols[4],
				"nhóm tổ": cols[5],
			},
		} satisfies Timerow;

		rows.push(row);
	}

	return { semester, rows };
}
