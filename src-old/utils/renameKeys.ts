export function renameKeys<Obj extends object, Dict extends { [K in PropertyKey]: string }>(
	dictionary: Dict,
	obj: Obj,
): { [K in keyof Obj as K extends keyof Dict ? Dict[K] : K]: Obj[K] } {
	for (const key in dictionary) {
		const newKey = dictionary[key];
		if (newKey in obj) {
			throw new Error(`Cannot rename keys into already existed key ${newKey}`);
		}
		// @ts-ignore
		obj[newKey] = obj[key];
		// @ts-ignore
		delete obj[key];
	}
	// @ts-ignore
	return obj;
}

const x = renameKeys({ a: "b" } as const, { a: "10", h: 10 });
