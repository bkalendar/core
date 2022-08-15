export { parse as parseClipboard } from "./clipboard/index.js";
export { parse as parseJson } from "./json/index.js";
import type { Semester } from "./json/semester.js";
import type { Timerow } from "./json/timerow.js";
import type { Weeks } from "./json/weeks.js";

export interface Timetable<R = Timerow> {
	timerows: R[];
	semester: Semester;
}
export type { Semester, Weeks, Timerow };
