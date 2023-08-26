import { z } from "zod";
import { groupKeys, renameKeys } from "../../utils/index.ts";
import { timeSchema } from "./time.ts";
import { weeksSchema } from "./weeks.ts";

export const timerowSchema = makeSchema();

type RawTimerow = z.infer<typeof timerowSchema>;

export interface Timerow<
	T = RawTimerow["time"],
	I = RawTimerow["info"],
	L = RawTimerow["location"],
> {
	time: T;
	info: I;
	location: L;
}

function makeSchema() {
	const schema = z
		.object({
			ma_mh: z.string(),
			ten_mh: z.string(),
			nhomto: z.string(),
			tuan_hoc: weeksSchema,
			macoso: z.string(),
			thu1: z.number(),
			giobd: timeSchema,
			giokt: timeSchema,
			phong1: z.string(),
			tc_hp: z.number(),
			so_tin_chi: z.number(),
		})
		.transform((timerow) =>
			renameKeys(
				{
					ma_mh: "course" as const,
					ten_mh: "name" as const,
					nhomto: "group" as const,
					tc_hp: "tuition" as const,
					so_tin_chi: "credits" as const,
					thu1: "weekday" as const,
					giobd: "startAt" as const,
					giokt: "endAt" as const,
					phong1: "room" as const,
					macoso: "branch" as const,
					tuan_hoc: "weeks" as const,
				},
				timerow,
			)
		)
		.transform((timeRow) =>
			groupKeys(
				{
					info: [
						"course" as const,
						"name" as const,
						"group" as const,
						"tuition" as const,
						"credits" as const,
					],
					time: [
						"weekday" as const,
						"startAt" as const,
						"endAt" as const,
						"weeks" as const,
					],
					location: ["room" as const, "branch" as const],
				},
				timeRow,
			)
		);

	return schema;
}
