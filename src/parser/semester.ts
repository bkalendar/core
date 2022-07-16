import { z } from "zod";

export const semesterSchema = makeSchema();
export type Semester = z.infer<typeof semesterSchema>;

function makeSchema() {
	const schema = z.preprocess(
		preprocess,
		z.object({
			year: z.number(),
			semester: z.number(),
		})
	);
	return schema;

	/**
	 * only works with this century
	 * @param raw something like 20213
	 * @returns something like `{ year: 2021, semester: 3 }`
	 */
	function preprocess(raw: unknown) {
		if (typeof raw !== "string") return null;

		const matches = /^(20\d\d)(\d)$/.exec(raw);
		if (!matches) return null;

		const year = Number(matches[1]);
		const semester = Number(matches[2]);
		return { year, semester };
	}
}
