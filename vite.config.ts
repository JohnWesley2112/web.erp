import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "@svgr/rollup";
import type { Plugin } from "esbuild";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/erp/",
    resolve: {
        alias: {
            src: resolve(__dirname, "src"),
        },
    },

    esbuild: {
        loader: "tsx",
        include: /src\/.*\.[tj]sx?$/,
        exclude: [],
    },

    optimizeDeps: {
        esbuildOptions: {
            loader: {
                ".js": "jsx",
                ".ts": "ts",
                ".tsx": "tsx",
            },

            plugins: [
                {
                    name: "load-ts-files-as-tsx",

                    setup(build) {
                        build.onLoad(
                            { filter: /src\\.*\.[tj]sx?$/ },
                            async (args) => ({
                                loader: args.path.endsWith(".tsx")
                                    ? "tsx"
                                    : args.path.endsWith(".ts")
                                      ? "ts"
                                      : "jsx",

                                contents: await fs.readFile(args.path, "utf8"),
                            }),
                        );
                    },
                } as Plugin,
            ],
        },
    },

    server: {
        host: true,
    },

    plugins: [svgr(), react()],
});
