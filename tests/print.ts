/// <reference types="node" />

import { test } from "uvu";
import { parse } from "../src/parser/clipboard";
import fixture from "./fixture.json";
import { resolve } from "../src/resolver";
import { transform } from "../src/transformer/ical";
import fs from "fs";

test("smoke", () => {
	const raw = fs.readFileSync("tests/fixture.txt", "utf8");
	const parsed = parse(raw);
	resolve(parsed);
	fs.writeFileSync("tests/output.txt", transform(parsed[parsed.length - 2]));
});

test.run();
