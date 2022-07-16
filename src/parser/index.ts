import { z } from "zod";
import { semesterSchema } from "./semester";
import { timerowSchema } from "./timerow";

export const schema = z.array(
	z.object({
		tkb: z.array(timerowSchema),
		hk_nh: semesterSchema,
	})
);

export type Timetable = z.infer<typeof schema>[number];
