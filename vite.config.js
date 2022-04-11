import { resolve, dirname } from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import dts from "vite-plugin-dts";

const _dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        lib: {
            entry: resolve(_dirname, "src/index.ts"),
            name: "bkalendar",
            fileName: (format) => `bkalendar.${format}.js`,
            formats: ["es", "umd"],
        },
    },
    plugins: [dts()],
});
