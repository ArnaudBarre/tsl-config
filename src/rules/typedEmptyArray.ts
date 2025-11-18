import { defineRule } from "tsl";
import { ruleTester } from "tsl/ruleTester";
import { SyntaxKind } from "typescript";

export const typedEmptyArray = defineRule(() => ({
  name: "arnaudBarre/typedEmptyArray",
  visitor: {
    VariableStatement(context, node) {
      for (const declaration of node.declarationList.declarations) {
        if (
          declaration.initializer
          && declaration.initializer.kind === SyntaxKind.ArrayLiteralExpression
          && declaration.initializer.elements.length === 0
          && !declaration.type
        ) {
          context.report({
            node: declaration.name,
            message: "Empty array needs explicit type annotation",
          });
        }
      }
    },
  },
}));

export function test() {
  ruleTester({
    ruleFn: typedEmptyArray,
    valid: [
      "const foo: string[] = []",
      "let foo: string[] = []",
      "var foo: number[] = []",
      "const bar: Array<number> = []",
      "const baz = [1, 2, 3]",
    ],
    invalid: [
      {
        code: "const foo = []",
        error: "Empty array needs explicit type annotation",
      },
      {
        code: "let bar = []",
        error: "Empty array needs explicit type annotation",
      },
      {
        code: "var baz = []",
        error: "Empty array needs explicit type annotation",
      },
      {
        code: "const bar = [], baz = []",
        errors: [
          { message: "Empty array needs explicit type annotation" },
          { message: "Empty array needs explicit type annotation" },
        ],
      },
    ],
  });
}
