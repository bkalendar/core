import { renameKeys } from "../utils/renameKeys";
import { z } from "zod";
import { semesterSchema } from "./semester";
import { timerowSchema } from "./timerow";

export const schema = z.array(
	z
		.object({
			tkb: z.array(timerowSchema),
			hk_nh: semesterSchema,
		})
		.transform((timetable) =>
			renameKeys({ tkb: "timerows" as const, hk_nh: "semester" as const }, timetable)
		)
);

export type Timetable = z.infer<typeof schema>[number];
