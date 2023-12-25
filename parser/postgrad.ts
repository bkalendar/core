import {
	NumOfColumnMismatchError,
	SemesterNotFoundError,
	TableNotFoundError,
} from "@/parser/errors.ts";
import { Timerow, Timetable } from "@/timetable.ts";
import { hmFrom } from "@/parser/utils.ts";
import { ParseError } from "@/mod.ts";

const HEADER =
	"cán bộ giảng dạy\tmôn học\tlớp/ds lớp\tthứ\ttiết bắt đầu\ttiết kết thúc\tphòng\ttuần\tghi chú";
const COLS = HEADER.split("\t").length;

export function parsePostgrad(src: string): Timetable {
	const lines = src.split("\n");
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].toLowerCase() == HEADER) {
			return parseFromHeader(lines, i);
		}
	}
	throw new TableNotFoundError(src);
}

function parseFromHeader(lines: string[], i: number): Timetable {
	// from the header, go back 4 lines and extract the semester
	const matches = lines[i - 4]?.match(/^Học kỳ ([123])\/(\d+)-(\d+): (\d+)\/(\d+)\/(\d+)/);
	if (!matches) {
		throw new SemesterNotFoundError(lines[i - 4]);
	}
	// "Học kỳ 2/2023-2024 - ..." should yield semester=232
	const semester = (Number(matches[2]) % 100) * 10 + Number(matches[1]);
	const startMondayUTC = new Date(
		Date.UTC(Number(matches[6]), Number(matches[5]) - 1, Number(matches[4])),
	);

	const rows = [];
	i++;
	for (; i < lines.length; i++) {
		if (lines[i].trim() == "" || lines[i].startsWith("Tối")) break;

		// a sample timerow:
		//          (0)                            (1)               (2)  (3)(4)(5)    (6)         (7)        (8)
		// GS.TS Phan Thị Tươi..(CO5143) - Xử lý ngôn ngữ tự nhiên..1 / ..CN..4..6..Trực tuyến..|1|2|3|4|5|..
		const cols = lines[i].split("\t");
		if (cols.length != COLS) {
			throw new NumOfColumnMismatchError(lines[i], COLS, cols.length);
		}
		const weekday = {
			"Hai": 2,
			"Ba": 3,
			"Tư": 4,
			"Năm": 5,
			"Sáu": 6,
			"Bảy": 7,
			"CN": 8,
		}[cols[3]];
		if (!weekday) throw new ParseError(lines[i], `Cannot parse weekday: ${cols[3]}`);

		const startHm = hmFrom(Number(cols[4])).startHm;
		const endHm = hmFrom(Number(cols[5])).endHm;
		// trim the leading and trailing '|'
		const weeks = cols[7].slice(1, -1).split("|").map((s) => s == "--" ? null : Number(s));

		const row = {
			name: cols[1],
			weekday,
			startHm,
			endHm,
			weeks,
			location: cols[6],
			extras: {
				"cán bộ giảng dạy": cols[0],
				"lớp": cols[2],
				"ghi chú": cols[8],
			},
		} satisfies Timerow;

		rows.push(row);
	}

	return { semester, startMondayUTC, rows };
}
