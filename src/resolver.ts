import { resolveFirstDate } from './date_utils';
import type { EntryRaw, Entry } from './entry';
import type { TimetableRaw, Timetable, parseTimetables } from './timetable';
import type { SemesterContext } from './date_utils';

/**
 * Resolve raw timetables into resolved timetables.
 *
 * This takes care of "orphans" and merges entries.
 *
 * @param timetableRaws list of raw timetables,
 * preferably from {@link parseTimetables}
 */
export function resolveTimetables(
    timetableRaws: TimetableRaw[]
): Timetable[] {
    const newTimetables: Timetable[] = [];
    let allOrphans: EntryRaw[] = [];

    for (const timetable of timetableRaws) {
        let firstDate = commonFirstDate(timetable);
        const { resolved, orphans } = resolveEntries(timetable, firstDate);
        newTimetables.push({
            ...timetable,
            entries: resolved,
            start: firstDate,
        });
        allOrphans.push(...orphans);
    }
    for (const timetable of newTimetables) {
        let rawTimetable: TimetableRaw = { ...timetable, entries: allOrphans };
        const { resolved, orphans } = resolveEntries(
            rawTimetable,
            timetable.start
        );
        allOrphans = orphans;
        timetable.entries.push(...resolved);
        timetable.entries.sort((a, b) => {
            let diff = a.wday - b.wday;
            if (diff === 0) diff = a.start - b.start;
            return diff;
        });
        mergeEntriesResolved(timetable.entries);
    }

    if (allOrphans.length != 0) {
        console.warn("Found orphan(s):", allOrphans);
    }

    return newTimetables;
}

function commonFirstDate(timetable: TimetableRaw): Date {
    const multiset: Record<number, number> = {};
    for (const entry of timetable.entries) {
        // we can do nothing with empty weeks
        if (entry.weeks.find(Boolean) === undefined) continue;
        const firstDate = resolveFirstDate(entry.weeks, timetable);
        // get or init 0
        const currentCount = multiset[+firstDate] || 0;
        multiset[+firstDate] = currentCount + 1;
    }
    // NOTE: potentially empty multiset?
    const maxCount = Math.max(...Object.values(multiset));
    const maxKey = Object.entries(multiset).find(
        ([_, count]) => count == maxCount
    )[0];
    return new Date(Number(maxKey));
}


/**
 * Resolve raw entries using a start date.
 *
 * Rule out orphans (start at a different week than others)
 *
 * @param timetable raw timetable
 * @param start start date, from {@link SemesterContext}
 * @returns entries of that timetable and found orphans
 */
function resolveEntries(
    timetable: TimetableRaw,
    start: Date
): {
    resolved: Entry[];
    orphans: EntryRaw[];
} {
    const resolved: Entry[] = [];
    const orphans: EntryRaw[] = [];
    for (const entry of timetable.entries) {
        // empty weeks, huh?
        if (entry.weeks.find(Boolean) === undefined) {
            console.warn("Discard entry without weeks", entry);
            continue;
        }
        const firstDate = resolveFirstDate(entry.weeks, timetable);
        if (+start === +firstDate) {
            const firstWeek = entry.weeks.findIndex(Boolean);
            const lastWeek = entry.weeks.length - 1;
            resolved.push({
                ...entry,
                firstWeek,
                lastWeek,
                excludeWeeks: entry.weeks
                    // get indices of only falsy weeks
                    .map((n, i) => isNaN(n) && i),
                // slice to make firstWeek first element
                // .slice(firstWeek)
                // filter out truthy weeks
                // .filter(Boolean),
                // NOTE: above logic moved to entry merging process
            });
        } else {
            orphans.push(entry);
        }
    }
    return { resolved, orphans };
}

/**
 * Merge two entries. Throw if unidentical, so remember to check the hash before merging.
 * @returns Merged entry
 */
function mergeEntryResolved(
    entry1: Entry,
    entry2: Entry
): Entry {
    if (entry1.hash != entry2.hash)
        throw new Error("Cannot merge two different entries");

    let exclude1 = [...entry1.excludeWeeks, false];
    let exclude2 = [...entry2.excludeWeeks, false];
    for (let i = exclude1.length; i < exclude2.length; i += 1) {
        exclude1.push(i);
    }
    for (let i = exclude2.length; i < exclude1.length; i += 1) {
        exclude2.push(i);
    }
    // console.log(exclude1, exclude2);

    let sortedWeeks = [];
    for (
        let i = 0;
        i < Math.max(entry1.excludeWeeks.length, entry2.excludeWeeks.length);
        i += 1
    ) {
        if (exclude1[i] !== false && exclude2[i] !== false) sortedWeeks.push(i);
    }

    return {
        ...entry2,
        firstWeek: Math.min(entry1.firstWeek, entry2.firstWeek),
        lastWeek: Math.max(entry1.lastWeek, entry2.lastWeek),
        excludeWeeks: sortedWeeks,
    };
}

function mergeEntriesResolved(entries: Entry[]) {
    for (let i = 0; i < entries.length; i += 1) {
        if (entries[i].hash == entries[i + 1]?.hash) {
            entries[i] = mergeEntryResolved(entries[i], entries[i + 1]);
            entries.splice(i + 1, 1);
        }
        entries[i].excludeWeeks = entries[i].excludeWeeks.filter(
            (x: number | false) => x !== false
        );
    }
}