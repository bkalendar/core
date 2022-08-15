import { z } from "zod";
import { renameKeys } from "../../utils/index.js";
import { semesterSchema } from "./semester.js";
import { timerowSchema } from "./timerow.js";

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

export function parse(json: unknown): Timetable[] {
	return schema.parse(json);
}

export type Timetable = z.infer<typeof schema>[number];
