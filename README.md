# @bkalendar/core

<a href="https://npmjs.org/package/@bkalendar/core">
  <img src="https://img.shields.io/npm/v/@bkalendar/core.svg"
       alt="npm version">
</a>

This package seeks to unify data types for writing stuff related to HCMUT timetables.

> ⚠️ Need help with writing tests or double-checking codes. See [#1](https://github.com/bkalendar/core/issues/1).


## Problems to address

-   **Human weeks into machine weeks**: Let's say we're in academic years 2022 - 2023. Week 50 on the timetable surely means year 2022, but what about week 35? Would it be at the start of the first semester, or at the end of the summer semester?
-   **"Orphans" entries**: Overdue entries (which should be finished but somehow made it into another semesters) have a different start week than others. This phenomenon happened when lab classes are delayed indefinitely.



## Installation

```bash
pnpm install @bkalendar/core@latest --save
```

## Usage

Parse and resolve paste results from [stinfo](https://mybk.hcmut.edu.vn/stinfo):

```js
import { parseTimetables, resolveTimetables } from "@bkalendar/core";

// should includes first lines metadata (semester, academic years)
const raw = `Học kỳ 1 Năm học 2021 - 2022
Ngày cập nhật:2021-12-22 10:41:38.0
Mã MH	Tên môn học	Tín chỉ	Tc học phí	Nhóm-Tổ	Thứ	Tiết	Giờ học	Phòng	Cơ sở	Tuần học
CO200B	Cấu trúc dữ liệu và giải thuật (mở rộng) 	--	--	TNMT	--	0-0	0:00 - 0:00	------	BK-CS1	--|
CO200D	Kiến trúc máy tính (mở rộng) 	--	--	TNMT	--	0-0	0:00 - 0:00	------	BK-CS1	33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|`

const rawTimetables = parseTimetables(raw)
const timetables = resolveTimetables(rawTimetables)
```

Or by other different means to create `TimetableRaw`, e.g parse HTML source file, and pass the resulting `TimetableRaw`s to the resolver.

## API docs

### `TimetableRaw` and `EntryRaw`

Raw timetables which uses human dates and knows nothing about machine dates.

```ts
interface TimetableRaw {
    semester: number;
    yearFrom: number;
    yearTo: number;
    entries: EntryRaw[];
}
interface EntryRaw {
    /** hash id from (id, room, wday, start, end) */
    readonly hash: string;
    readonly id: string;
    readonly room: string;
    /** day of the week */
    readonly wday: number;
    readonly start: number;
    readonly end: number;
    /** e.g. L05, L11, ... */
    group: string;
    name: string;

    weeks: number[];
}
```

### `Timetable` and `Entry`

Resolved timetables with knowledge about machine dates.

```ts
interface Timetable {
    semester: number;
    yearFrom: number;
    yearTo: number;
    entries: Entry[];
    /** 00:00 UTC Monday of the first week */
    start: Date;
}
interface Entry {
    /** hash id from (id, room, wday, start, end) */
    readonly hash: string;
    readonly id: string;
    readonly room: string;
    /** day of the week */
    readonly wday: number;
    readonly start: number;
    readonly end: number;
    /** e.g. L05, L11, ... */
    group: string;
    name: string;

    /** offset of week (inclusive) from the first week of semester */
    firstWeek: number;
    /** offset of week (inclusive) from the first week of semester */
    lastWeek: number;
    /** offset of weeks from the first week of semester */
    excludeWeeks: number[];
}
```

### `parseTimetables(raw: string): TimetableRaw[]`

Parse the paste result from stinfo.

### `resolveTimetables(timetableRaws: TimetableRaw[]): Timetable[]`

Resolve raw timetables into resolved timetables.

This takes care of orphans and merges entries.