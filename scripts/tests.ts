import { readdirSync } from "node:fs";

const rules = readdirSync("src/rules").filter((f) => f.endsWith(".ts"));

let fileFocus = process.argv.at(2);
if (fileFocus && !fileFocus.endsWith(".ts")) fileFocus = `${fileFocus}.ts`;
if (fileFocus?.startsWith("arnaudBarre/")) fileFocus = fileFocus.slice(12);
if (fileFocus?.startsWith("src/rules/")) fileFocus = fileFocus.slice(10);
let hasError = false;

for (const rule of rules) {
  if (fileFocus && rule !== fileFocus) continue;
  const module = (await import(`../src/rules/${rule}`)) as {
    test?: () => boolean;
  };
  if (module.test) {
    const result = module.test();
    hasError ||= result;
  } else {
    hasError = true;
    console.log(`No tests for ${rule}`);
  }
}

if (hasError) process.exit(1);
