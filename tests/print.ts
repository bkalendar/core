import { test } from "uvu";
import { schema } from "../src/parser";
import { timerowSchema } from "../src/parser/timerow";
import { weekSchema } from "../src/parser/week";

test("smoke", () => {
	console.log(
		timerowSchema.parse({
			ma_mh: "MT1003",
			ten_mh: "Giải tích 1",
			nhomto: "L25",
			tuan_hoc: "--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|02|03|",
			macoso: "BK-CS2",
			thu1: 3,
			tiet_bd1: 2,
			tiet_kt1: 4,
			phong1: "H1-304",
			tc_hp: 4,
			so_tin_chi: 4,
			ma_nhom: "L25",
			mssv: "2011364",
			hk_nh: "20201",
			ten_hocky: "Học kỳ 1 Năm học 2020 - 2021",
			giobd: "7:00",
			giokt: "9:50",
			ngay_cap_nhat: "2021-01-14T03:49:18.000+0000",
		})
	);
});

test.run();
