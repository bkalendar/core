/// <reference types="node" />

import { test } from "uvu";
import { parse } from "../src/parser/clipboard";
import fixture from "./fixture.json";
import { resolve } from "../src/resolver";
import { transform } from "../src/transformer/gapi";
import fs from "fs";

test("smoke", () => {
	const raw = fs.readFileSync("tests/fixture.txt", "utf8");
	const parsed = parse(raw);
	resolve(parsed);
	// console.log(JSON.stringify(parsed, null, 4));
});

test.run();
