import { parseClipboard } from "./parser/index.js";
import { reorganize } from "./refine/index.js";
import { transformICal } from "./transformer/index.js";

export default function (raw: string) {
	let timetables = parseClipboard(raw);
	reorganize(timetables);
	return timetables.map((timetable) => ({
		semester: timetable.semester,
		ical: transformICal(timetable),
	}));
}
