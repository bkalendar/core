import type { Timerow, Timetable } from "../../parser/index.js";
import { transformTime } from "./time.js";

export interface MachineTimerow
	extends Timerow<{
		start: Date;
		end: Date;
		until: Date;
		exceptions: Date[];
	} | null> {}

export type MachineTimetable = Timetable<MachineTimerow>;

/**
 * transform into machine readable timetable
 *
 * this mainly converts wall clock time into Date objects. use this as a building block.
 */
export function transform({ timerows, semester }: Timetable): MachineTimetable {
	let machineTimerows: MachineTimerow[] = [];
	for (const timerow of timerows) {
		let machineTime = transformTime(timerow.time, semester);
		machineTimerows.push({
			...timerow,
			time: machineTime,
		});
	}
	return { timerows: machineTimerows, semester };
}
