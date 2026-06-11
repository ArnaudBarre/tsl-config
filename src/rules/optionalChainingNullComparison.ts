import { defineRule, type AST } from "tsl";
import { ruleTester } from "tsl/ruleTester";
import { SyntaxKind } from "typescript";

const error =
  "This comparison makes the undefined case not easy to follow. Handle undefined case explicitly.";
export const optionalChainingNullComparison = defineRule(() => ({
  name: "arnaudBarre/optionalChainingNullComparison",
  visitor: {
    BinaryExpression(context, node) {
      if (
        (node.operatorToken.kind === SyntaxKind.EqualsEqualsEqualsToken
          || node.operatorToken.kind
            === SyntaxKind.ExclamationEqualsEqualsToken)
        && node.right.kind === SyntaxKind.NullKeyword
        && node.left.kind === SyntaxKind.PropertyAccessExpression
        && hasOptionalChain(node.left)
      ) {
        context.report({ node, message: error });
      }
    },
  },
}));

const hasOptionalChain = (node: AST.PropertyAccessExpression): boolean =>
  node.questionDotToken !== undefined
  || (node.expression.kind === SyntaxKind.PropertyAccessExpression
    && hasOptionalChain(node.expression));

export function test() {
  ruleTester({
    ruleFn: optionalChainingNullComparison,
    valid: ["a?.b", "a.b !== null", "a.b === null"],
    invalid: [
      { code: "a?.b !== null", error },
      { code: "a?.b === null", error },
      { code: "a?.b.c !== null", error },
      { code: "a.b?.c === null", error },
    ],
  });
}
