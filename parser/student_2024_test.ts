import { parseStudent2024 } from "@/parser/student_2024.ts";
import { SemesterNotFoundError } from "@/parser/errors.ts";
import { assertEquals, assertThrows } from "std/assert/mod.ts";

Deno.test("smoke", () => {
	const src = `
myBk/app
Toggle navigation
User ImageNNB
User Image
NNB

 Khoa Kỹ Thuật Xây Dựng
Sinh viên
Dịch vụ sinh viên
Kết quả học tập
 Tài liệu hướng dẫn
Hệ thống quản lý Quản lý người dùng
 Quản lý người dùng Người dùng
 Trở về trang trước
THỜI KHÓA BIỂU HỌC KỲ
Họ tên: NNB ()

Tuần: 19 , Thứ Sáu, Ngày 10/5/2024

Ghi chú: Các môn học có trong Thời khóa biểu là kết quả đăng ký môn học chính thức.Sinh viên chỉ được thực hiện Đồ án, Thực tập, Luận văn tốt nghiệp, ... và được ghi điểm vào cuối học kỳ khi các môn này có trong Thời khóa biểu (có phân nhóm). Với các môn không có Thứ, Tiết, Phòng: sinh viên liên hệ Bộ môn/Khoa để được hướng dẫn.

 
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
Dạ okee
`;
	const timetable = parseStudent2024(src);
	assertEquals(timetable.semester, 232);
	assertEquals(timetable.rows.length, 8);
});
