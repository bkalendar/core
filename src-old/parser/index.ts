export { parse as parseClipboard } from "./clipboard/index.ts";
export { parse as parseJson } from "./json/index.ts";
import type { Semester } from "./json/semester.ts";
import type { Timerow } from "./json/timerow.ts";
import type { Weeks } from "./json/weeks.ts";

export interface Timetable<R = Timerow> {
	timerows: R[];
	semester: Semester;
}
export type { Semester, Timerow, Weeks };
