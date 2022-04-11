import type { SemesterContext } from "./date_utils";
import type { EntryRaw, Entry } from "./entry";
import { parseEntry } from "./entry";

/**
 * A raw timetable which knows nothing about machine dates.
 */
export interface TimetableRaw extends SemesterContext {
    entries: EntryRaw[];
}

/**
 * A resolved timetable with resolved dates and weeks.
 */
export interface Timetable extends SemesterContext {
    entries: Entry[];
    /** 00:00 UTC Monday of the first week */
    start: Date;
}

/**
 * Parse the paste result into a list of raw timetables (all semesters)
 * @param raw what you get from Ctrl-A and copy at
 * [stinfo](https://mybk.hcmut.edu.vn/stinfo).
 */
export function parseTimetables(raw: string): TimetableRaw[] {
    const pattern =
        /Học kỳ (?<semester>\d) Năm học (?<yearFrom>\d+) - (?<yearTo>\d+)\n[^\n]*\n[^\n]*\n(?<entries>(?:[^](?!Tổng số tín chỉ đăng ký))*)/g;
    return [...raw.matchAll(pattern)].map((match) => ({
        semester: Number(match.groups.semester),
        yearFrom: Number(match.groups.yearFrom),
        yearTo: Number(match.groups.yearTo),
        entries: match.groups.entries
            .split("\n")
            .map((rawEntry) => parseEntry(rawEntry.trim()))
            .filter(Boolean),
    }));
}
