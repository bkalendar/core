import {
	NumOfColumnMismatchError,
	ParseError,
	SemesterNotFoundError,
	TableNotFoundError,
} from "@/parser/errors.ts";
import { Timerow, Timetable } from "@/timetable.ts";
import { parseTime } from "@/parser/utils.ts";

const HEADER = "Lớp\tTên MH\tPhòng\tDãy\tThứ\tSố tiết\tTiết\tGiờ\tTuần học\t% ND";
const COLS = HEADER.split("\t").length;

export function parse(src: string): Timetable {
	src = src.trim();

	let matches = src.match(/Năm học (\d+)/);
	if (!matches) {
		throw new SemesterNotFoundError(src);
	}
	const yearFrom = Number(matches[1]);

	matches = src.match(/Học kỳ ([123])/);
	if (!matches) {
		throw new SemesterNotFoundError(src);
	}
	const semester = (yearFrom % 100) * 10 + Number(matches[1]);

	const lines = src.split("\n");
	for (let i = 0; i < lines.length; i++) {
		if (lines[i] == HEADER) {
			return {
				semester,
				rows: parseFromHeader(lines, i),
			};
		}
	}
	throw new TableNotFoundError(src);
}

function parseFromHeader(lines: string[], i: number): Timerow[] {
	const rows = [];
	i++;
	for (; i < lines.length; i++) {
		if (lines[i].startsWith("Đang xem")) break;

		// a sample timerow:
		//       (0)                    (1)             (2)   (3)(4)(5)(6)      (7)                   (8)              (9)
		// 20221_CO1006_L11..NHAP MON DIEN TOAN (TH)..H6-707..H6..5.. .. ..12:00 - 16:50..--|--|--|--|--|--|--|--|43|..0%
		const cols = lines[i].split("\t");
		if (cols.length != COLS) {
			throw new NumOfColumnMismatchError(lines[i], COLS, cols.length);
		}
		const weekday = Number(cols[4]);
		const times = cols[7].split(" - ");
		if (times.length != 2) {
			throw new ParseError(cols[7], `Time column is not separated by " - "`);
		}
		const startHm = parseTime(times[0]);
		const endHm = parseTime(times[1]);
		// trim the trailing '|'
		const weeks = cols[8].slice(0, -1).split("|").map((s) => s == "--" ? null : Number(s));

		const row = {
			name: cols[1],
			weekday,
			startHm,
			endHm,
			weeks,
			location: cols[2],
			extras: {
				"lớp": cols[0],
			},
		} satisfies Timerow;

		rows.push(row);
	}

	return rows;
}
