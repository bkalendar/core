import { test } from "uvu";
import { schema } from "../src/parser";
import fixture from "./fixture.json";
import { resolve } from "../src/resolver";

test("smoke", () => {
	const timetables = schema.parse(fixture);
	resolve(timetables);
	console.log(JSON.stringify(timetables, undefined, 4));
});

test.run();
