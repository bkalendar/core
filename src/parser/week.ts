import { z } from "zod";

export const weekSchema = makeSchema();

export type Week = z.infer<typeof weekSchema>;

function makeSchema() {
	const schema = z.preprocess(
		preprocess,
		z
			.object({
				base: z.number().nullable(),
				newYear: z.number().nullable(),
				from: z.number(),
				until: z.number(),
				exceptions: z.array(z.number()),
			})
			.nullable()
	);

	return schema;

	function preprocess(raw: unknown) {
		if (typeof raw !== "string") return null;

		// this function parse something like this:
		// --|02|03|04|--|--|07|08|09|--|--|--|--|14|--|16|17|
		// the way it works is as follow:

		// STEP 1: map index -> week
		const weeks: Map<number, number> = new Map();

		// 3 characters per column
		for (let index = 0; index < raw.length / 3; index++) {
			// take two numbers, or "--"
			const week = parseInt(raw.substring(3 * index, 3 * index + 2));
			if (!isNaN(week)) weeks.set(index, week);
		}

		if (weeks.size == 0) return null;

		// STEP 2: convert to start, end and exceptions
		let exceptions: number[] = [];
		let from = -1,
			until = -1,
			exception = -1;
		for (const index of weeks.keys()) {
			if (from < 0) {
				// initialize start index
				from = index;
			} else {
				for (let i = exception; i < index; i++) {
					exceptions.push(i);
				}
			}
			exception = index + 1;
			until = index;
		}

		// STEP 3: find base week (possibly an exception) and year boundary for classification
		let base: number | null = null;
		let newYear: number | null = null;

		for (const [index, week] of weeks.entries()) {
			// for example, week 2 at index 2 means new year's at index 1
			if (week - index <= 0) {
				newYear = index - week + 1;
				break;
			}
			// else, initialize base week
			if (!base) {
				base = week - index;
			}
		}

		return {
			base,
			newYear,
			from,
			until,
			exceptions,
		};
	}
}
