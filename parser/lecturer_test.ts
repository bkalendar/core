import { parseLecturer } from "@/parser/lecturer.ts";
import { SemesterNotFoundError } from "@/parser/errors.ts";
import { assertEquals, assertThrows } from "@std/assert";

Deno.test("smoke", () => {
	const src = `
Năm học 2022

Học kỳ 1
   
Tìm:
Lớp	Tên MH	Phòng	Dãy	Thứ	Số tiết	Tiết	Giờ	Tuần học	% ND
20221_CO1006_L11	NHAP MON DIEN TOAN (TH)	H6-707	H6	5			12:00 - 16:50	--|--|--|--|--|--|--|--|43|	0%
20221_CO1006_L11	NHAP MON DIEN TOAN (TH)	HANGOUT_TUONGTAC	LIVE_HOME	5			12:00 - 16:50	--|--|--|--|--|--|--|--|--|--|--|46|47|	
20221_CO1006_L23	NHAP MON DIEN TOAN (TH)	H6-707	H6	5			12:00 - 16:50	--|--|--|--|--|--|--|--|--|--|45|--|--|--|--|--|51|	0%
20221_CO1006_L23	NHAP MON DIEN TOAN (TH)	HANGOUT_TUONGTAC	LIVE_HOME	5			12:00 - 16:50	--|--|--|--|--|--|--|--|--|--|--|46|47|	
20221_CO1006_L11	NHAP MON DIEN TOAN (TH)	HANGOUT_TUONGTAC	LIVE_HOME	5			12:00 - 16:50	--|--|--|--|--|--|--|--|--|--|--|--|--|--|49|	
Đang xem 1 đến 5 trong tổng số 5 mục	`;
	const timetable = parseLecturer(src);
	assertEquals(timetable.semester, 221);
	assertEquals(timetable.rows.length, 5);
});

Deno.test("throws on missing semester", () => {
	const src = `
Lớp	Tên MH	Phòng	Dãy	Thứ	Số tiết	Tiết	Giờ	Tuần học	% ND
20221_CO1006_L11	NHAP MON DIEN TOAN (TH)	H6-707	H6	5			12:00 - 16:50	--|--|--|--|--|--|--|--|43|	0%
	`;
	assertThrows(() => parseLecturer(src), SemesterNotFoundError);
});

Deno.test("works without last line", () => {
	const src = `
Năm học 2022

Học kỳ 1
   
Tìm:
Lớp	Tên MH	Phòng	Dãy	Thứ	Số tiết	Tiết	Giờ	Tuần học	% ND
20221_CO1006_L11	NHAP MON DIEN TOAN (TH)	H6-707	H6	5			12:00 - 16:50	--|--|--|--|--|--|--|--|43|	0%
	`;
	const timetable = parseLecturer(src);
	assertEquals(timetable.rows.length, 1);
});
