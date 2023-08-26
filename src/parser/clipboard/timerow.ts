import { timerowSchema } from "../json/timerow.ts";

export function parseTimerow(raw: string) {
	// transform raw text into json object from ajax call

	// a sample timerow:
	//   (0)       (1)       (2)(3) (4) (5)  (6)        (7)        (8)     (9)                     (10)
	// CH1003..Hóa đại cương..3..3..L14..6..10-12..15:00 - 17:50..H2-301..BK-CS2..--|09|10|11|12|13|14|15|16|--|18|19|
	const cells = raw.split("\t");
	const rawTimerow = {
		ma_mh: cells[0],
		ten_mh: cells[1],
		so_tin_chi: parseInt(cells[2]) || 0, // expected number, not string
		tc_hp: parseInt(cells[3]) || 0,
		nhomto: cells[4],
		thu1: parseInt(cells[5]) || 0,
		giobd: cells[7].split(" - ")[0],
		giokt: cells[7].split(" - ")[1],
		phong1: cells[8],
		macoso: cells[9],
		tuan_hoc: cells[10],
	};

	return timerowSchema.parse(rawTimerow);
}
