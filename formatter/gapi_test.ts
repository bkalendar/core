import { parseStudent } from "@/parser/student.ts";
import { resolve } from "@/resolver.ts";
import { formatGapi } from "@/formatter/gapi.ts";
import { assertSnapshot } from "std/testing/snapshot.ts";
import { parseLecturer } from "@/parser/lecturer.ts";

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
	const gapi = formatGapi(timetable);
	await assertSnapshot(t, gapi);
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
	const gapi = formatGapi(timetable);
	await assertSnapshot(t, gapi);
});
