# type-lint-config [![npm](https://img.shields.io/npm/v/@arnaud-barre/type-lint-config)](https://www.npmjs.com/package/@arnaud-barre/type-lint-config)

Ongoing port of https://github.com/ArnaudBarre/eslint-config for https://github.com/ArnaudBarre/type-lint

## Install

```sh
bun add -D @arnaud-barre/type-lint @arnaud-barre/type-lint-config
```

```js
// type-lint.config.ts
import { defineConfig } from "@arnaud-barre/type-lint";
import { allRules } from "@arnaud-barre/type-lint-config";

export default defineConfig({
  rules: [...allRules],
});
```

```json
// package.json
"scripts": {
  "tsc": "type-lint"
}
```

## TS config (5.8)

### Web project

```json
{
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleDetection": "force",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client", "@arnaud-barre/type-lint/patches"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true,
    "noUncheckedSideEffectImports": true,
    "noPropertyAccessFromIndexSignature": true,

    "plugins": [{ "name": "@arnaud-barre/type-lint/plugin" }]
  }
}
```

### Node project (20-22)

```json
{
  "include": ["**/*.ts"],
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleDetection": "force",
    "lib": ["ES2023"],
    "types": ["node", "@arnaud-barre/type-lint/patches"],
    "skipLibCheck": true

    /* Same as web */
  }
}
```

## Prettier config (3.5.3)

### Web projects

```json
// package.json
"prettier": {
  "experimentalOperatorPosition": "start",
  "xmlWhitespaceSensitivity": "ignore",
  "plugins": [
    "@arnaud-barre/prettier-plugin-sort-imports",
    "@prettier/plugin-xml"
  ]
}
```

### Node projects

```json
// package.json
"prettier": {
  "experimentalOperatorPosition": "start",
  "plugins": [
    "@arnaud-barre/prettier-plugin-sort-imports"
  ]
}
```

### Custom rules

- jsxKey: Validate JSX has key prop when in array or iterator
- arrayCallbackReturn: Ensure array callbacks that require a return value (map, filter, find, some, ...) don't have undefined in their return type
- jsxNoNumberTruthiness: Disallow `list.length && ...` in JSX
