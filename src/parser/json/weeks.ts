import { z } from "zod";

export const weeksSchema = makeSchema();

export type Weeks = NonNullable<z.infer<typeof weeksSchema>>;

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

	/**
	 * One interesting thing to note is how we represent the weeks. One naive way to represent is to just
	 * use an array of numbers:
	 * ```json
	 * [49, 50, null, 52, 53, 1, 2, 3]
	 * ```
	 *
	 * This is simple and faithful to the raw data, but later on when you need to combine the semester and
	 * year to get the `Date`, this will become pure nightmare.
	 *
	 * After 4 or 5 times of rewrite, I think I found a good-enough representation:
	 *
	 * ```json
	 * {
	 * 	"from": 0,
	 * 	"until": 7,
	 * 	"base": 49,
	 * 	"newYear": 5,
	 * 	"exceptions": [2]
	 * }
	 * ```
	 *
	 * `from`, `until` and `exceptions` are represented by the indices in the array, not the weeks, and
	 * must be calculated relative to the `base` or `newYear`.
	 */
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

		// base is the WEEK with INDEX 0
		let base: number | null = null;
		// newYear is the INDEX of WEEK 1
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
