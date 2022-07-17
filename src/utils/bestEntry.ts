export function bestEntry<K, V>(map: Map<K, V>, compare: (a: V, b: V) => number): [K, V] | null {
	let bestValue: V | null = null;
	let bestKey: K | null = null;
	for (const [key, value] of map.entries()) {
		if (!bestValue || compare(value, bestValue) > 0) {
			bestKey = key;
			bestValue = value;
		}
	}

	if (!bestKey || !bestValue) return null;

	return [bestKey, bestValue];
}
