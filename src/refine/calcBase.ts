import { addWeeks, startOfWeek, subWeeks } from "date-fns";
import type { Semester, Weeks } from "../parser/index.js";

export function calcBase(weeks: Weeks, semester: Semester): Date {
	// case 1: has a new year break, hence it span 2 years
	if (weeks.newYear !== null) {
		// is there a better way to handle timezone??? *wink wink Temporal*
		const newYear = new Date(semester.year + 1, 0, 4);
		// offset new year into base date
		const base = startOfWeek(subWeeks(newYear, weeks.newYear), { weekStartsOn: 1 });
		return base;
	}

	// case 2: no new year break, semester 1 always starts early
	else if (semester.semester == 1) {
		const oldYear = new Date(semester.year, 0, 4);
		const base = startOfWeek(addWeeks(oldYear, weeks.base! - 1), { weekStartsOn: 1 });
		return base;
	}

	// case 3: no new year break, semester 2 and 3 always starts late
	else {
		const newYear = new Date(semester.year + 1, 0, 4);
		const base = startOfWeek(addWeeks(newYear, weeks.base! - 1), { weekStartsOn: 1 });
		return base;
	}
}
