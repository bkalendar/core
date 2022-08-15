import { addWeeks } from "date-fns";
import type { Timerow, Timetable } from "../parser/index.js";
import type { MachineTimerow } from "../transformer/machine/index.js";

type GenericMachineTimerow<I, L> = Timerow<MachineTimerow["time"], I, L>;
type GenericMachineTimetable<I, L> = Timetable<GenericMachineTimerow<I, L>>;

type DiffEntry<I, L> = [Date, GenericMachineTimerow<I, L>];

interface Criteria<I, L> {
	info: I;
	location: L;
}

export function diff<I, L>(
	src: GenericMachineTimetable<I, L>,
	dst: GenericMachineTimetable<I, L>,
	same: (src: Criteria<I, L>, dst: Criteria<I, L>) => boolean
): { added: DiffEntry<I, L>[]; removed: DiffEntry<I, L>[] } {
	let added: DiffEntry<I, L>[] = [];
	let removed: DiffEntry<I, L>[] = [];

	let map: Map<string, GenericMachineTimerow<I, L>[]> = new Map();
	let nullSrcRows = [];

	let getKey = (date: Date, duration: number) =>
		`${Math.trunc(+date / 1000)}-${Math.trunc(duration / 1000)}`;

	let extractKey = (key: string): [Date, number] => {
		let [rdate, rdur] = key.split("-");
		return [new Date(parseInt(rdate) * 1000), parseInt(rdur) * 1000];
	};

	for (const srcRow of src.timerows) {
		let { time } = srcRow;
		if (!time) {
			nullSrcRows.push(srcRow);
			continue;
		}

		let duration = +time.end - +time.start;
		let exCount = 0;
		for (let date = time.start; +date <= +time.until; date = addWeeks(date, 1)) {
			if (+date == +time.exceptions[exCount]) {
				exCount += 1;
				continue;
			}
			let key = getKey(date, duration);
			let slot = map.get(key);
			if (slot) {
				slot.push(srcRow);
			} else {
				map.set(key, [srcRow]);
			}
		}
	}

	for (const dstRow of dst.timerows) {
		let { time } = dstRow;
		if (!time) {
			for (const k in nullSrcRows) {
				let srcRow = nullSrcRows[k];
				if (same(srcRow, dstRow)) {
					delete nullSrcRows[k];
					break;
				}
			}
			continue;
		}

		let duration = +time.end - +time.start;
		let exCount = 0;
		outer: for (let date = time.start; +date <= +time.until; date = addWeeks(date, 1)) {
			if (+date == +time.exceptions[exCount]) {
				exCount += 1;
				continue;
			}

			let key = getKey(date, duration);
			let srcRows = map.get(key);

			if (srcRows) {
				let hasSame = false;
				for (const k in srcRows) {
					let srcRow = srcRows[k];
					if (same(srcRow, dstRow)) {
						delete srcRows[k];
						hasSame = true;
                        // the loop could ended early here, but there might be duplicated srcRows
                        // so it sets a flag and continues
					}
				}
				if (hasSame) continue outer;
			}

			// dst has it, but src doesn't
			removed.push([date, dstRow]);
			continue;
		}
	}

	// the remaining, src has those but dst doesn't
	for (const [key, srcRows] of map.entries()) {
		for (const k in srcRows) {
			let srcRow = srcRows[k];
			added.push([extractKey(key)[0], srcRow]);
		}
	}

	return { added, removed };
}
