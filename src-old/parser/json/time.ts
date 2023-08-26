import { z } from "zod";

export const timeSchema = z.preprocess(
	(raw) => {
		if (typeof raw !== "string") return null;

		const matches = /^(\d+):(\d+)$/.exec(raw);
		if (!matches) return null;

		const hour = parseInt(matches[1]);
		const minute = parseInt(matches[2]);

		return { hour, minute };
	},
	z.object({
		hour: z.number(),
		minute: z.number(),
	}),
);

export type Time = z.infer<typeof timeSchema>;
