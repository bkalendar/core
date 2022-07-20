export function groupKeys<
	Obj extends { [K: PropertyKey]: unknown },
	Dict extends { [K: PropertyKey]: (keyof Obj)[] }
>(
	dictionary: Dict,
	obj: Obj
): {
	[K in keyof Dict]: {
		[U in keyof Obj as U extends Dict[K][number] ? U : never]: Obj[U];
	};
} {
	const grouped: Record<string, Record<string, unknown>> = {};
	for (const [groupKey, props] of Object.entries(dictionary)) {
		let key: typeof props[number];
		for (key of props) {
			const group = grouped[groupKey];
			if (group === undefined) {
				grouped[groupKey] = { [key]: obj[key] };
			} else {
				// @ts-ignore
				group[key] = obj[key];
			}
		}
	}
	// @ts-ignore
	return grouped;
}
