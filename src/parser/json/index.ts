import { z } from "zod";
import { renameKeys } from "../../utils";
import { semesterSchema } from "./semester";
import { timerowSchema } from "./timerow";

const schema = z.array(
	z
		.object({
			tkb: z.array(timerowSchema),
			hk_nh: semesterSchema,
		})
		.transform((timetable) =>
			renameKeys({ tkb: "timerows" as const, hk_nh: "semester" as const }, timetable)
		)
);

export function parse(json: unknown) {
	return schema.parse(json);
}

export type Timetable = z.infer<typeof schema>[number];
export type { Semester } from "./semester";
export type { Timerow } from "./timerow";
export type { Weeks } from "./weeks";
