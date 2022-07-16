import type { AtLeastOneOf } from "./utils";

export {};

export type X = AtLeastOneOf<{
	firstWeek: number;
	yearBoundary: number;
}>;
