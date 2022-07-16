import type { Simplify } from "src/utils";
import { z } from "zod";
import { timeSchema } from "./time";
import { weekSchema } from "./week";

export const timerowSchema = makeSchema();

export type Timerow = z.infer<typeof timerowSchema>;
export type TimerowInfo = Timerow["info"];
export type TimerowTime = Timerow["time"];
export type TimerowLocation = Timerow["location"];

function makeSchema() {
	const schema = z.object({
		ma_mh: z.string(),
		ten_mh: z.string(),
		nhomto: z.string(),
		tuan_hoc: weekSchema,
		macoso: z.string(),
		thu1: z.number(),
		giobd: timeSchema,
		giokt: timeSchema,
		phong1: z.string(),
		tc_hp: z.number(),
		so_tin_chi: z.number(),
	});

	const translatedSchema = schema.transform(translate);
	const groupedSchema = translatedSchema.transform(group);
	return groupedSchema;

	type RawTimerow = z.infer<typeof schema>;
	function translate(timerow: RawTimerow) {
		const translated: Record<string, unknown> = {};
		let key: keyof typeof dictionary;
		for (key in dictionary) {
			translated[dictionary[key]] = timerow[key];
		}
		return translated as {
			-readonly [K in keyof typeof dictionary as typeof dictionary[K]]: RawTimerow[K];
		};
	}

	type TranslatedTimerow = z.infer<typeof translatedSchema>;
	function group(timerow: TranslatedTimerow) {
		const grouped: Record<string, Record<string, unknown>> = {};
		for (const [groupKey, props] of Object.entries(groups)) {
			let key: typeof props[number];
			for (key of props) {
				const group = grouped[groupKey];
				if (group === undefined) {
					grouped[groupKey] = { [key]: timerow[key] };
				} else {
					group[key] = timerow[key];
				}
			}
		}

		return grouped as {
			[K in keyof typeof groups]: {
				[U in typeof groups[K][number]]: TranslatedTimerow[U];
			};
		};
	}
}

const dictionary = {
	ma_mh: "course",
	ten_mh: "name",
	nhomto: "group",
	tc_hp: "tuition",
	so_tin_chi: "credits",
	thu1: "weekday",
	giobd: "startAt",
	giokt: "endAt",
	phong1: "room",
	macoso: "branch",
	tuan_hoc: "weeks",
} as const;

const groups = {
	info: ["course", "name", "group", "tuition", "credits"] as const,
	time: ["weekday", "startAt", "endAt", "weeks"] as const,
	location: ["room", "branch"] as const,
};
