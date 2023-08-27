export type Timetable = {
	semester: number;
	rows: Timerow[];
};

export type Timerow = {
	name: string;
	weekday: number;
	startHm: [number, number];
	endHm: [number, number];
	recurrenceRule: RecurrenceRule;
	location: string;
	extras: Record<string, string>;
};

export type RecurrenceRule =
	| {
		type: "raw";
		weeks: (number | null)[];
	}
	| {
		type: "resolved";
		start: YearMonthDay;
		end: YearMonthDay;
		excludes: YearMonthDay[];
	};
export type ResolvedRecurrenceRule = RecurrenceRule & { type: "resolved" };
export type ResolvedTimerow = Timerow & { recurrenceRule: ResolvedRecurrenceRule };
export type ResolvedTimetable = Timetable & { rows: ResolvedTimerow[] };

export type YearMonthDay = [number, number, number];
