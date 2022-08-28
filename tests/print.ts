/// <reference types="node" />

import { test } from "uvu";
import { parse } from "../src/parser/clipboard";
import fixture from "./fixture.json";
import { diff, reorganize } from "../src/refine";
import { transform } from "../src/transformer/ical";
import fs from "fs";
import { transformMachine } from "../src/transformer/index.js";

test("smoke", () => {
	let raw = fs.readFileSync("tests/fixture.txt", "utf8");
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

test.run();
