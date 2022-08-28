import type { Timerow, Timetable } from "../parser/index.js";
import { z } from "zod";

type GenericTimerow<T, L> = Timerow<T, { course: string; name: string }, L>;
type GenericTimetable<T, L> = Timetable<GenericTimerow<T, L>>;

export async function translate<T, L>(
	{ timerows }: GenericTimetable<T, L>,
	options?: { lang?: "vi" | "en" }
) {
	const lang = options?.lang ?? "vi";
	for (const { info } of timerows) {
		const data = await getData(info.course);
		info.name = data[lang];
	}
}

const dataSchema = z
	.object({
		monhoc: z.string(),
		course: z.string(),
	})
	.transform(({ course, monhoc }) => ({ vi: monhoc, en: course }));

async function getData(course: string): Promise<{ vi: string; en: string }> {
	// polyfill fetch
	// @ts-ignore
	let fetch: typeof import("node-fetch").default = globalThis?.fetch;
	if (!fetch && process?.versions?.node) {
		fetch = (await import("node-fetch")).default;
	}

	const res = await fetch(
		`https://github.com/bkalendar/courses/blob/master/courses/${course}.json`
	);
	const body = await res.json();
	return dataSchema.parse(body);
}
