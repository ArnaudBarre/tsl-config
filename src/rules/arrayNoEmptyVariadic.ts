import { defineRule } from "tsl";
import { ruleTester } from "tsl/ruleTester";
import { SyntaxKind } from "typescript";

const methods = ["push", "unshift", "concat"];

export const arrayNoEmptyVariadic = defineRule(() => ({
  name: "arnaudBarre/arrayNoEmptyVariadic",
  visitor: {
    PropertyAccessExpression(context, node) {
      if (
        node.name.kind === SyntaxKind.Identifier
        && methods.includes(node.name.text)
        && node.parent.kind === SyntaxKind.CallExpression
        && node.parent.arguments.length === 0
      ) {
        context.report({
          start: node.name.getStart(),
          end: node.parent.getEnd(),
          message: "This call does nothing",
        });
      }
    },
  },
}));

export function test() {
  ruleTester({
    ruleFn: arrayNoEmptyVariadic,
    valid: ["[].push(1)", "[].unshift(2)", "[].concat(3)"],
    invalid: [
      {
        code: "[].push()",
        error: "This call does nothing",
      },
      {
        code: "[].unshift()",
        error: "This call does nothing",
      },
      {
        code: "[].concat()",
        error: "This call does nothing",
      },
    ],
  });
}
