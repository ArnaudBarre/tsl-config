# @arnaud-barre/tsl-config [![npm](https://img.shields.io/npm/v/@arnaud-barre/tsl-config)](https://www.npmjs.com/package/@arnaud-barre/tsl-config)

Ongoing port of https://github.com/ArnaudBarre/eslint-config for https://github.com/ArnaudBarre/tsl

## Install

```sh
bun add -D tsl @arnaud-barre/tsl-config
```

```js
// tsl.config.ts
import { allRules } from "@arnaud-barre/tsl-config";
import { defineConfig } from "tsl";

export default defineConfig({
  rules: [...allRules],
});
```

```json
// package.json
"scripts": {
  "tsc": "tsl"
}
```

## TS config (5.9)

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
    "types": ["vite/client", "tsl/patches"],
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

    "plugins": [{ "name": "tsl/plugin" }]
  }
}
```

### Node project (22)

```json
{
  "include": ["**/*.ts"],
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleDetection": "force",
    "lib": ["es2024", "ESNext.Array", "ESNext.Collection", "ESNext.Iterator"],
    "types": ["node", "tsl/patches"],
    "skipLibCheck": true

    /* Same as web */
  }
}
```

### Node project (24)

```json
{
  "include": ["**/*.ts"],
  "compilerOptions": {
    "target": "ES2024",
    "module": "ESNext",
    "moduleDetection": "force",
    "lib": [
      "es2024",
      "ESNext.Array",
      "ESNext.Collection",
      "ESNext.Iterator",
      "ESNext.Promise"
    ],
    "types": ["node", "tsl/patches"],
    "skipLibCheck": true

    /* Same as web */
  }
}
```

## Prettier config (3.6.2)

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
