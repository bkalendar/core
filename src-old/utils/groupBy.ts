export function groupBy<Item, Key>(list: Item[], getKey: (item: Item) => Key) {
	const map = new Map<Key, Item[]>();
	list.forEach((item) => {
		const key = getKey(item);
		const group = map.get(key);
		if (group) {
			group.push(item);
		} else {
			map.set(key, [item]);
		}
	});
	return map;
}
