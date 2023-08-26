import { parse } from "../src/parser/clipboard/index.ts";
import { diff, reorganize } from "../src/refine/index.ts";
import { transform } from "../src/transformer/ical.ts";
import { transformMachine } from "../src/transformer/index.ts";

Deno.test("smoke", async () => {
	let raw = await Deno.readTextFile("tests/fixture.txt");
	let timetables = parse(raw);
	reorganize(timetables);
	let dst = transformMachine(timetables[0]);

	console.log(transform(dst));

	// raw = fs.readFileSync("tests/fixture copy.txt", "utf8");
	// timetables = parse(raw);
	// reorganize(timetables);
	// let src = transformMachine(timetables[0]);

	// console.log(dst, src);

	// console.log(
	// 	diff(src, dst, (s, d) => {
	// 		return s.location.room == d.location.room && s.info.course == d.info.course;
	// 	})
	// );
});
