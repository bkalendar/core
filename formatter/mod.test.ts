import { parseStudent } from "@/parser/student.ts";
import { resolve } from "@/resolver.ts";
import { formatGapi } from "@/formatter/gapi.ts";
import { assertSnapshot } from "@std/testing/snapshot";
import { parseLecturer } from "@/parser/lecturer.ts";
import { parsePostgrad } from "@/parser/postgrad.ts";
import { parseStudent2024 } from "@/parser/student_2024.ts";

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

Deno.test("snapshot student 2024", async (t) => {
	const src = `
20232 - Học kỳ 2 Năm học 2023 - 2024(Hiện hành)
Ngày cập nhật gần nhất của HK này: 08/05/2024 15:27:53
Trình bày 
10
 dòng/trang
Tìm kiếm:
HỌC KỲ	MÃ MH	TÊN MÔN HỌC	TÍN CHỈ	TC HỌC PHÍ	NHÓM - TỔ	THỨ	TIẾT	GIỜ HỌC	PHÒNG	CƠ SỞ	TUẦN HỌC
20232	SA0001	Sinh hoạt Sinh viên	0	0	L45	--	--	--	CS-DiAn	BK-DAn	02|03|04|05|--|--|08|09|10|--|--|--|--|--|16|17|18|19|20|21|22|23|
20232	MI1003	Giáo dục Quốc phòng	0	0	A01	--	--	--	CS-LTK	BK-LTK	--|--|--|--|--|--|--|--|--|--|12|13|14|15|
20232	PE1033	Bóng đá (Học phần 2)	0	0	L10	2	10 - 13	15:00 - 17:50	TT THE DUC THE THAO	NGOAITRUONG	02|03|04|05|--|--|08|09|10|--|--|--|--|--|16|17|--|19|20|21|22|23|
20232	CI1034	Vẽ kỹ thuật Xây dựng (ThL,TN)	0	0	L04	2	2 - 7	7:00 - 11:50	H6-708	BK-DAn	--|--|--|--|--|--|--|--|--|--|--|--|--|--|16|--|--|--|20|--|22|
20232	CH1004	Hóa đại cương (TN)	0	0	L33	4	8 - 13	13:00 - 17:50	H1-501	BK-DAn	--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|20|21|22|23|
20232	CI1033	Vẽ kỹ thuật Xây dựng	3	3	L02	4	4 - 6	9:00 - 10:50	H6-114	BK-DAn	--|--|04|--|--|--|08|--|10|--|--|--|--|--|16|
20232	CI1069	Khoa học Trái đất	4	4	L04	5	7 - 10	12:00 - 14:50	H6-308	BK-DAn	02|03|04|05|--|--|08|09|10|--|--|--|--|--|--|17|18|19|20|21|22|23|
20232	CI1033	Vẽ kỹ thuật Xây dựng	3	3	L02	5	5 - 7	10:00 - 11:50	H6-413	BK-DAn	02|03|04|05|--|--|08|09|10|--|--|--|--|--|--|17|18|19|20|21|22|23|
20232	CH1003	Hóa đại cương	3	3	L11	6	10 - 12	15:00 - 16:50	H1-802	BK-DAn	02|03|04|05|--|--|08|09|10|--|--|--|--|--|16|17|18|19|20|21|22|23|
20232	MT1005	Giải tích 2	4	4	L18	6	7 - 10	12:00 - 14:50	H3-301	BK-DAn	02|03|04|05|--|--|08|09|10|--|--|--|--|--|16|17|18|19|20|21|22|23|
Trình bày từ dòng 1 đến 10 / 11 dòng
Lùi12Tới
Tổng số tín chỉ đăng ký: 17
Version 2.4.0Copyright © 2024 Academic Affairs Office. All rights reserved.
Bạn đã gửi
thanks em
Dạ okee`;
	const timetable = parseStudent2024(src);
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

Deno.test("snapshot MK", async (t) => {
	const src = `20233 - Học kỳ 3 Năm học 2023 - 2024
Ngày cập nhật gần nhất của HK này: 31/05/2024 14:28:54
Trình bày  dòng/trang
Tìm kiếm:
HỌC KỲ	MÃ MH	TÊN MÔN HỌC	TÍN CHỈ	TC HỌC PHÍ	NHÓM - TỔ	THỨ	TIẾT	GIỜ HỌC	PHÒNG	CƠ SỞ	TUẦN HỌC
20233	SP1007	Pháp luật Việt Nam Đại cương	2	2	DL04	3	9 - 11	14:00 - 15:50	H6-212	BK-DAn	25|26|27|28|--|30|31|
20233	SP1031	Triết học Mác - Lênin	3	3	DL07	3	7 - 9	12:00 - 13:50	H6-212	BK-DAn	25|26|27|28|--|30|31|32|33|`;

	const timetable = parseStudent2024(src);
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

Deno.test("handle Sunday as 'CN'", async (t) => {
	const src = `20241 - Học kỳ 1 Năm học 2024 - 2025
Ngày cập nhật gần nhất của HK này: 21/08/2024 11:44:24
Trình bày 
100
 dòng/trang
Tìm kiếm:
HỌC KỲ	MÃ MH	TÊN MÔN HỌC	TÍN CHỈ	TC HỌC PHÍ	NHÓM - TỔ	THỨ	TIẾT	GIỜ HỌC	PHÒNG	CƠ SỞ	TUẦN HỌC
20241	SP1039	Lịch sử Đảng Cộng sản Việt Nam	2	2	DT01	CN	3 - 5	8:00 - 9:50	B1-212	BK-LTK	35|36|37|38|39|40|41|--|43|44|45|46|47|48|49|50|`;

	const timetable = parseStudent2024(src);
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
