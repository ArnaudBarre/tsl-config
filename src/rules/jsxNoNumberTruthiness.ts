import { defineRule } from "@arnaud-barre/type-lint";
import { ruleTester } from "@arnaud-barre/type-lint/ruleTester";
import { isTypeFlagSet, unionConstituents } from "ts-api-utils";
import { SyntaxKind, TypeFlags } from "typescript";

const message =
  "Don't use logical expression on a number inside JSX, you might render the character 0 instead of rendering nothing. Either use a ternary expression or more explicit condition";

export const jsxNoNumberTruthiness = defineRule(() => ({
  name: "arnaudBarre/jsxNoNumberTruthiness",
  visitor: {
    BinaryExpression(node, context) {
      if (node.operatorToken.kind !== SyntaxKind.AmpersandAmpersandToken) {
        return;
      }
      if (node.parent.kind !== SyntaxKind.JsxExpression) return;
      const type = context.checker.getTypeAtLocation(node.left);
      if (
        unionConstituents(type).some((subType) =>
          isTypeFlagSet(subType, TypeFlags.NumberLike),
        )
      ) {
        context.report({ node, message });
      }
    },
  },
}));

export function test() {
  ruleTester({
    ruleFn: jsxNoNumberTruthiness,
    valid: [
      {
        tsx: true,
        code: "const loading: boolean; <>{loading && 'Ok'}</>",
      },
      {
        tsx: true,
        code: "const loading: boolean | undefined; <>{loading && 'Ok'}</>",
      },
      {
        tsx: true,
        code: "const list: string[]; <>{list.length > 0 && 'Ok'}</>",
      },
    ],
    invalid: [
      {
        tsx: true,
        code: "const list: string[]; <>{list.length && 'Not ok'}</>",
        error: message,
      },
      {
        tsx: true,
        code: "const num: number; <>{num && 'Not ok'}</>",
        error: message,
      },
    ],
  });
}
