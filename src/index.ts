import { parseClipboard, parseJson, Timetable } from "./parser/index.js";
import { reorganize } from "./refine/index.js";
import { MachineTimetable, transformMachine } from "./transformer/index.js";
export type { MachineTimetable };

export function parseMachine(raw: string | object): MachineTimetable[] {
	let timetables: Timetable[];
	if (typeof raw === "string") {
		timetables = parseClipboard(raw);
	} else if (typeof raw === "object") {
		timetables = parseJson(raw);
	} else {
		throw new TypeError("argument must be a string or JSON object");
	}

	reorganize(timetables);

	return timetables.map(transformMachine);
}
