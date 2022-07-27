import type { Timerow, Timetable } from "../parser";
import { calcBase } from "../transformer/calcBase";
import { bestEntry, groupBy } from "../utils";

export function resolve(timetables: Timetable[]) {
	// sort timetables by ascending semester.
	// we do this to push all unresolved timerows into newer timetable
	// because unresolved timerows can't reference old timetable.
	timetables.sort((a, b) => {
		if (a.semester.year == b.semester.year) {
			return a.semester.semester - b.semester.semester;
		}
		return a.semester.year - b.semester.year;
	});

	// resolve the correct weeks of timetables, using majority votes
	let leftovers: Timerow[] = [];
	for (const timetable of timetables) {
		// pour all leftovers from previous loop to resolve
		timetable.timerows.push(...leftovers);
		leftovers = [];

		// standard groupBy operation
		const votes = groupBy(
			timetable.timerows,
			(timerow) =>
				timerow.time.weeks && calcBase(timerow.time.weeks, timetable.semester).getTime()
		);

		// store nullish entries, i.e, ones without weeks, "--|"
		const nullishs: Timerow[] = votes.get(null) || [];
		votes.delete(null);

		// picking best base with most votes
		const best = bestEntry(votes, (a, b) => a.length - b.length);

		// if we can't get a best base, welp that's it
		if (best === null) {
			console.error("there's no way i can resolve this timetable", timetable);
			leftovers.push(...timetable.timerows);
			continue;
		}

		// get voters result from votes
		const [bestKey, bestVoters] = best;
		const majority = bestVoters!;
		votes.delete(bestKey);
		const localLeftovers = Array.from(votes.values()).flat();

		timetable.timerows = majority.concat(nullishs);
		leftovers.push(...localLeftovers);
	}

	if (leftovers.length != 0) {
		console.error("unresolved timerows", leftovers);
	}
}
