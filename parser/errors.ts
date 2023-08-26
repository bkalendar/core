export class ParseError extends Error {
	constructor(public src: string, message: string) {
		super(`Error "${message}" while parsing "${src}"`);
	}
}

export class SemesterNotFoundError extends ParseError {
	constructor(public src: string) {
		super(src, "Cannot extract semester and years");
	}
}

export class NumOfColumnMismatchError extends ParseError {
	constructor(public src: string, public expected: number, public found: number) {
		super(src, `Expected ${expected} column(s), found ${found} columns`);
	}
}

export class TableNotFoundError extends ParseError {
	constructor(public src: string) {
		super(src, `Cannot find any timetable`);
	}
}
