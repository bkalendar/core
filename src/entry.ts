import hash from "object-hash";

interface Common {
    /** hash id from (id, room, wday, start, end) */
    readonly hash: string;
    readonly id: string;
    readonly room: string;
    readonly wday: number;
    readonly start: number;
    readonly end: number;
    group: string;
    name: string;
}

export interface EntryRaw extends Common {
    weeks: number[];
}

export interface EntryResolved extends Common {
    /** offset of week (inclusive) from the first week of semester */
    firstWeek: number;
    /** offset of week (inclusive) fom the first week of semester */
    lastWeek: number;
    /** offset of weeks from the first week of semester */
    excludeWeeks: number[];
}

export function parseEntry(raw: string): EntryRaw | null {
    const pattern =
        /^(?<id>[^\t]*)\t(?<name>[^\t]*)\t[^\t]*\t[^\t]*\t(?<group>[^\t]*)\t(?<wday>\d)\t(?<start>\d+)-(?<end>\d+)\t[^\t]*\t(?<room>[^\t]*)\t[^\t]*\t(?<weeks>.*)\|$/;
    const match = raw.match(pattern);

    if (!match) return null;

    const required = {
        id: match.groups.id,
        wday: Number(match.groups.wday),
        start: Number(match.groups.start),
        end: Number(match.groups.end),
        room: match.groups.room,
    };

    return {
        ...required,
        hash: hash(required, { algorithm: "md5" }),
        name: match.groups.name.trim(),
        group: match.groups.group,
        weeks: match.groups.weeks.split("|").map(Number),
    };
}