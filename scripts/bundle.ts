import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { build } from "tsdown";
import packageJSON from "../package.json" with { type: "json" };

await build({ entry: "src/index.ts", dts: true });

execSync("cp LICENSE README.md dist/");

writeFileSync(
  "dist/package.json",
  JSON.stringify(
    {
      name: packageJSON.name,
      description: packageJSON.description,
      version: packageJSON.version,
      author: packageJSON.author,
      license: packageJSON.license,
      repository: "github:ArnaudBarre/tsl-config",
      type: "module",
      exports: {
        ".": "./index.js",
      },
      peerDependencies: packageJSON.peerDependencies,
    },
    null,
    2,
  ),
);
