import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts";

await emptyDir("./npm");

await build({
	entryPoints: ["./mod.ts"],
	outDir: "./npm",
	test: false,
	shims: {},
	importMap: "deno.json",
	compilerOptions: {
		lib: ["DOM", "ESNext"],
	},
	package: {
		name: "@bkalendar/core",
		version: Deno.args[0],
		description: "HCMUT timetable library.",
		license: "MIT",
		repository: {
			type: "git",
			url: "git+https://github.com/bkalendar/core.git",
		},
		bugs: {
			url: "https://github.com/bkalendar/core/issues",
		},
		publishConfig: {
			registry: "https://npm.pkg.github.com",
		},
	},
	postBuild() {
		Deno.copyFileSync("LICENSE", "npm/LICENSE");
		Deno.copyFileSync("README.md", "npm/README.md");
	},
});
