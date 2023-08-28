export type Timetable = {
	semester: number;
	startMondayUTC?: Date;
	rows: Timerow[];
};

export type Timerow = {
	name: string;
	weekday: number;
	/** hh:mm in +07:00 timezone */
	startHm: [number, number];
	/** hh:mm in +07:00 timezone */
	endHm: [number, number];
	weeks: (number | null)[];
	location: string;
	/** see `parseStudent` and `parseLecturer` for possible keys */
	extras: Record<string, string>;
};
