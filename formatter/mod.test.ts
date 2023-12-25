import { parseStudent } from "@/parser/student.ts";
import { resolve } from "@/resolver.ts";
import { formatGapi } from "@/formatter/gapi.ts";
import { assertSnapshot } from "std/testing/snapshot.ts";
import { parseLecturer } from "@/parser/lecturer.ts";
import { parsePostgrad } from "@/parser/postgrad.ts";

Deno.test("snapshot student", async (t) => {
	const src = `
Học kỳ 1 Năm học 2020 - 2021
Ngày cập nhật:2021-01-14 13:44:46.0
MÃ MH	TÊN MÔN HỌC	TÍN CHỈ	TC HỌC PHÍ	NHÓM-TỔ	THỨ	TIẾT	GIỜ HỌC	PHÒNG	CƠ SỞ	TUẦN HỌC
MI1003	Giáo dục quốc phòng	--	1	L02	--	0-0	0:00 - 0:00	------	BK	--|--|--|--|--|--|45|46|47|48|
PE1023	Võ (Vovinam, Karate, Taewondo) (học phần 1)	--	1.5	L262	2	10-12	15:00 - 17:50	CS2-NHATHIDAU-SAN1	BK-DAn	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|02|03|
MT1003	Giải tích 1	4	4	L25	3	2-4	7:00 - 9:50	H1-304	BK-DAn	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|02|03|
PH1003	Vật lý 1	4	4	L24	4	8-10	13:00 - 15:50	H1-301	BK-DAn	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|02|03|
MT1004	GIAI TICH 1 (BT)	--	--	L44	5	10-11	15:00 - 16:50	H1-103	BK-DAn	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|02|03|
PE1023	Võ (Vovinam, Karate, Taewondo) (học phần 1)	--	1.5	L262	6	10-12	15:00 - 17:50	CS2-NHATHIDAU-SAN1	BK-DAn	--|--|--|42|43|44|--|--|--|--|49|50|--|52|--|01|02|03|
Tổng số tín chỉ đăng ký: 8
	`;
	const timetable = parseStudent(src);
	resolve(timetable);

	await t.step("format gapi", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});

	await t.step("format ical", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});
});

Deno.test("snapshot lecturer", async (t) => {
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
	resolve(timetable);

	await t.step("format gapi", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});

	await t.step("format ical", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});
});

Deno.test("snapshot postgrad", async (t) => {
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
	resolve(timetable);

	await t.step("format gapi", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});

	await t.step("format ical", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});
});

Deno.test("timetable with no weeks", async (t) => {
	// Thanks bạn DQL for this testcase
	const src = `
Học kỳ 1 Năm học 2023 - 2024
Ngày cập nhật:2023-09-04 20:25:44.0
MÃ MH	TÊN MÔN HỌC	TÍN CHỈ	TC HỌC PHÍ	NHÓM-TỔ	THỨ	TIẾT	GIỜ HỌC	PHÒNG	CƠ SỞ	TUẦN HỌC
ME3009	Các quá trình chế tạo	3	3	L01	6	2-3	7:00 - 8:50	H1-102	BK-DAn	--|
ME3009	Các quá trình chế tạo	3	3	L01	6	2-3	7:00 - 8:50	H1-102	BK-DAn	--|--|--|--|--|--|--|--|--|--|--|46|47|48|49|50|
Tổng số tín chỉ đăng ký: 17
	`;
	const timetable = parseStudent(src);
	resolve(timetable);

	await t.step("format gapi", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});

	await t.step("format ical", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});
});

Deno.test("dash for empty time", async (t) => {
	const src = `
Học kỳ 1 Năm học 2020 - 2021
Ngày cập nhật:2021-01-14 13:44:46.0
MÃ MH	TÊN MÔN HỌC	TÍN CHỈ	TC HỌC PHÍ	NHÓM-TỔ	THỨ	TIẾT	GIỜ HỌC	PHÒNG	CƠ SỞ	TUẦN HỌC
MI1003	Giáo dục quốc phòng	--	1	L02	--	---	- - -	------	BK	--|--|--|--|--|--|45|46|47|48|
PH1003	Vật lý 1	4	4	L24	2	8-10	13:00 - 15:50	HANGOUT_TUONGTAC	BK-LTK	--|--|--|--|--|--|--|40|41|42|43|44|45|46|47|48|49|50|51|
	`;
	const timetable = parseStudent(src);
	resolve(timetable);

	await t.step("format gapi", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});

	await t.step("format ical", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});
});

Deno.test("case-insensitive header", async (t) => {
	const src = `
Học kỳ 1 Năm học 2023 - 2024
Ngày cập nhật:2023-12-22 09:41:14.0
Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
SA0002	Sinh hoạt Sinh viên	--	--	L290	--	---	- - -	CS-DiAn	BK-DAn	--|--|--|38|39|40|41|--|43|44|45|46|47|48|49|50|
CO4029	Đồ án Chuyên ngành	2	2	TN03	--	---	- - -	CS-DiAn	BK-DAn	35|36|37|38|39|40|41|--|43|44|45|46|47|48|49|50|
IM1021	Khởi nghiệp	3	3	L07	2	9-10	14:00 - 15:50	H6-214	BK-DAn	35|--|37|38|39|40|41|--|43|44|45|46|47|48|49|50|
Tổng số tín chỉ đăng ký: 11
	`;
	const timetable = parseStudent(src);
	resolve(timetable);

	await t.step("format gapi", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});

	await t.step("format ical", async (t) => {
		const gapi = formatGapi(timetable);
		await assertSnapshot(t, gapi);
	});
});
