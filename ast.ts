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
		type: "based";
		weekOfIndex0?: number;
		indexOfWeek1?: number;
		weeks: boolean[];
	}
	| {
		type: "resolved";
		mondayYmd: [number, number, number];
	};
