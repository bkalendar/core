import { test } from "uvu";
import { schema } from "../src/parser";
import fixture from "./fixture.json";
import { resolve } from "../src/resolver";
import { transform } from "../src/transformer/gapi";

test("smoke", () => {
	const timetables = schema.parse(fixture);
	resolve(timetables);
	const transformed = transform(timetables[timetables.length - 2]);
	console.log(transformed);
});

test.run();
