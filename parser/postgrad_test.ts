import { parsePostgrad } from "@/parser/postgrad.ts";
import { assertThrows } from "std/assert/assert_throws.ts";
import { assertEquals } from "std/assert/assert_equals.ts";
import { SemesterNotFoundError } from "@/parser/errors.ts";

Deno.test("smoke", () => {
	const src = `
Học kỳ 1/2023-2024: 04/09/2023 (Tuần 1)
Ngành: Khoa Học Máy Tính

Mã : 2010206Du Thành ĐạtKhóa: 2022
Cán bộ giảng dạy	Môn học	Lớp/DS lớp	Thứ	Tiết bắt đầu	Tiết kết thúc	Phòng	Tuần	Ghi chú
GS.TS Phan Thị Tươi	(CO5143) - Xử lý ngôn ngữ tự nhiên	1 / 	CN	4	6	Trực tuyến	|1|2|3|4|5|	
GS.TS Phan Thị Tươi	(CO5143) - Xử lý ngôn ngữ tự nhiên	1 / 	CN	4	6	601B4	|--|--|--|--|--|6|7|8|9|10|	
TS. Phan Trọng Nhân	(CO5240) - Kỹ thuật dữ liệu	1 / 	Sáu	13	15	305B4	|1|2|3|4|5|6|7|8|9|10|11|12|13|	
Tối
	`;
	const timetable = parsePostgrad(src);
	assertEquals(timetable.semester, 231);
	assertEquals(timetable.startMondayUTC, new Date(Date.UTC(2023, 8, 4)));
	assertEquals(timetable.rows.length, 3);
});

Deno.test("throws on missing semester", () => {
	const src = `
Cán bộ giảng dạy	Môn học	Lớp/DS lớp	Thứ	Tiết bắt đầu	Tiết kết thúc	Phòng	Tuần	Ghi chú
GS.TS Phan Thị Tươi	(CO5143) - Xử lý ngôn ngữ tự nhiên	1 / 	CN	4	6	Trực tuyến	|1|2|3|4|5|	
GS.TS Phan Thị Tươi	(CO5143) - Xử lý ngôn ngữ tự nhiên	1 / 	CN	4	6	601B4	|--|--|--|--|--|6|7|8|9|10|	
TS. Phan Trọng Nhân	(CO5240) - Kỹ thuật dữ liệu	1 / 	Sáu	13	15	305B4	|1|2|3|4|5|6|7|8|9|10|11|12|13|	
	`;
	assertThrows(() => parsePostgrad(src), SemesterNotFoundError);
});

Deno.test("works without last line", () => {
	const src = `
Học kỳ 1/2023-2024: 04/09/2023 (Tuần 1)
Ngành: Khoa Học Máy Tính

Mã : 2010206Du Thành ĐạtKhóa: 2022
Cán bộ giảng dạy	Môn học	Lớp/DS lớp	Thứ	Tiết bắt đầu	Tiết kết thúc	Phòng	Tuần	Ghi chú
GS.TS Phan Thị Tươi	(CO5143) - Xử lý ngôn ngữ tự nhiên	1 / 	CN	4	6	Trực tuyến	|1|2|3|4|5|	
	`;
	const timetable = parsePostgrad(src);
	assertEquals(timetable.rows.length, 1);
});
