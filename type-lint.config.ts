import { defineConfig } from "@arnaud-barre/type-lint";
import { allRules } from "./dist/index.js";

export default defineConfig({
  rules: [...allRules],
});
