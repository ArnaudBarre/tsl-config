# type-lint-config

Ongoing port of https://github.com/ArnaudBarre/eslint-config

## Install

```sh
yarn add --dev eslint @arnaud-barre/type-lint-config
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
  "lint": "bun lint-ci --fix --cache",
  "lint-ci": "eslint --max-warnings 0"
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
    "lib": ["ES2022", "DOM", "DOM.Iterable"],

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "noEmit": true,

    /* Linting */
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true,
    "noUncheckedSideEffectImports": true,
    "noPropertyAccessFromIndexSignature": true
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
    "lib": ["ES2023"]

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
