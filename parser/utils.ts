import { ParseError } from "@/parser/errors.ts";

export function parseTime(src: string): [number, number] {
	const nums = src.split(":");
	if (nums.length != 2) {
		throw new ParseError(src, `Time component is not separated by ":"`);
	}
	return [Number(nums[0]), Number(nums[1])];
}

export function hmFrom(tiết: number): { startHm: [number, number]; endHm: [number, number] } {
	if (tiết == 0) {
		return {
			startHm: [0, 0],
			endHm: [0, 0],
		};
	}
	if (tiết >= 1 && tiết <= 13) {
		return {
			startHm: [tiết + 5, 0],
			endHm: [tiết + 5, 50],
		};
	}
	if (tiết == 14) {
		return {
			startHm: [18, 50],
			endHm: [19, 40],
		};
	}
	if (tiết == 15) {
		return {
			startHm: [19, 40],
			endHm: [20, 30],
		};
	}
	if (tiết == 16) {
		return {
			startHm: [20, 30],
			endHm: [21, 20],
		};
	}
	if (tiết == 17) {
		return {
			startHm: [21, 20],
			endHm: [22, 10],
		};
	}
	throw new ParseError(`${tiết}`, "Tiết must be less than 18");
}
