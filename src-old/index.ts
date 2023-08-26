import { parseClipboard, parseJson, Timetable } from "./parser/index.ts";
import { reorganize } from "./refine/index.ts";
import { MachineTimetable, transformMachine } from "./transformer/index.ts";

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

export * from "./parser/index.ts";
export * from "./refine/index.ts";
export * from "./transformer/index.ts";
