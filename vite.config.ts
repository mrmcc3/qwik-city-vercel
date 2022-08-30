import { ConfigEnv, defineConfig, Plugin } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import * as fs from "fs/promises";

function vercelBuildOutputV3(): Plugin {
  let env: ConfigEnv;
  return {
    name: "vite-plugin-qwik-vercel",
    config(_config, configEnv) {
      env = configEnv;
    },
    async closeBundle() {
      if (env.ssrBuild) {
        await fs.writeFile(
          ".vercel/output/config.json",
          JSON.stringify({
            version: 3,
            routes: [
              {
                src: "/build/.+",
                headers: {
                  "cache-control":
                    "public, max-age=31536000, s-maxage=31536000, immutable",
                },
              },
              { handle: "filesystem" },
              { src: "/.*", dest: "/" },
            ],
          })
        );
        await fs.writeFile(
          ".vercel/output/functions/index.func/.vc-config.json",
          JSON.stringify({
            runtime: "edge",
            entrypoint: "entry.vercel.js",
          })
        );
      }
    },
  };
}

export default defineConfig(() => {
  return {
    ssr: { target: "webworker", noExternal: true },
    plugins: [
      qwikCity(),
      qwikVite({
        client: { outDir: ".vercel/output/static" },
        ssr: { outDir: ".vercel/output/functions/index.func" },
      }),
      vercelBuildOutputV3(),
      tsconfigPaths(),
    ],
  };
});
