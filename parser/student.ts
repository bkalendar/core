import {
	NumOfColumnMismatchError,
	ParseError,
	SemesterNotFoundError,
	TableNotFoundError,
} from "@/parser/errors.ts";
import { Timerow, Timetable } from "@/timetable.ts";
import { parseTime } from "@/parser/utils.ts";

const HEADER =
	"MÃ MH\tTÊN MÔN HỌC\tTÍN CHỈ\tTC HỌC PHÍ\tNHÓM-TỔ\tTHỨ\tTIẾT\tGIỜ HỌC\tPHÒNG\tCƠ SỞ\tTUẦN HỌC";
const COLS = HEADER.split("\t").length;

export function parseStudent(src: string): Timetable {
	src = src.trim();
	const lines = src.split("\n");
	for (let i = 0; i < lines.length; i++) {
		if (lines[i] == HEADER) {
			return parseFromHeader(lines, i);
		}
	}
	throw new TableNotFoundError(src);
}

function parseFromHeader(lines: string[], i: number): Timetable {
	// from the header, go back 2 lines and extract the semester
	const matches = lines[i - 2]?.match(/^Học kỳ ([123]) Năm học (\d+) - (\d+)$/);
	if (!matches) {
		throw new SemesterNotFoundError(lines[i - 2]);
	}
	// "Học kỳ 2 năm học 2023 - ..." should yield semester=232
	const semester = (Number(matches[2]) % 100) * 10 + Number(matches[1]);

	const rows = [];
	i++;
	for (; i < lines.length; i++) {
		if (lines[i].startsWith("Tổng số tín chỉ đăng ký:")) break;

		// a sample timerow:
		//   (0)       (1)       (2)(3) (4) (5)  (6)        (7)        (8)     (9)                     (10)
		// CH1003..Hóa đại cương..3..3..L14..6..10-12..15:00 - 17:50..H2-301..BK-CS2..--|09|10|11|12|13|14|15|16|--|18|19|
		const cols = lines[i].split("\t");
		if (cols.length != COLS) {
			throw new NumOfColumnMismatchError(lines[i], COLS, cols.length);
		}
		const weekday = Number(cols[5]);
		const times = cols[7].split(" - ");
		if (times.length != 2) {
			throw new ParseError(cols[7], `Time column is not separated by " - "`);
		}
		const startHm = parseTime(times[0]);
		const endHm = parseTime(times[1]);
		// trim the trailing '|'
		const weeks = cols[10].slice(0, -1).split("|").map((s) => s == "--" ? null : Number(s));

		const row = {
			name: cols[1],
			weekday,
			startHm,
			endHm,
			weeks,
			location: cols[8],
			extras: {
				"mã môn học": cols[0],
				"tín chỉ": cols[2],
				"tín chỉ học phí": cols[3],
				"nhóm tổ": cols[4],
			},
		} satisfies Timerow;

		rows.push(row);
	}

	return { semester, rows };
}
