import { addWeeks, startOfWeek, subWeeks } from "date-fns";
import type { Semester, Weeks } from "../parser/index.ts";

export function calcBase(weeks: Weeks, { semester, year }: Semester): Date {
	// case 1: has a new year break, hence it span 2 years
	if (weeks.newYear !== null) {
		const newYear = new Date(year + 1, 0, 4);
		// offset new year into base date
		const base = startOfWeek(subWeeks(newYear, weeks.newYear), { weekStartsOn: 1 });
		return base;
	} // case 2: no new year break, semester 1 always starts early
	else if (semester == 1) {
		return baseStarts("early");
	} // case 3: no new year break, semester 2 MAY start early
	else if (semester == 2) {
		return baseStarts(weeks.base! >= 26 ? "early" : "late");
	} // case 4: no new year break, semester 3 always starts late
	else if (semester == 3) {
		return baseStarts("late");
	}

	throw new Error(`unhandled semester: ${semester}`);

	function baseStarts(type: "early" | "late") {
		let week1 = new Date(type == "early" ? year : year + 1, 0, 4);
		const base = startOfWeek(addWeeks(week1, weeks.base! - 1), { weekStartsOn: 1 });
		return base;
	}
}
