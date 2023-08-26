import { ParseError } from "@/parser/errors.ts";

export function parseTime(src: string): [number, number] {
	const nums = src.split(":");
	if (nums.length != 2) {
		throw new ParseError(src, `Time component is not separated by ":"`);
	}
	return [Number(nums[0]), Number(nums[1])];
}
