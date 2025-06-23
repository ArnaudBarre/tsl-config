import { defineConfig } from "tsl";
import { allRules } from "./dist/index.js";

export default defineConfig({
  rules: [...allRules],
});
