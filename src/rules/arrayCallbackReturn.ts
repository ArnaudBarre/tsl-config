import { defineRule } from "tsl";
import { ruleTester } from "tsl/ruleTester";
import { SyntaxKind, TypeFlags } from "typescript";

const base =
  "Found undefined in the return type of this callback. It could come from a missing return statement.";

const messages = {
  shouldBeBoolean: base + " Update the code to return a boolean value.",
  flatMap:
    base
    + " If this is intentional, update the code to return an array of a single value.",
  addTypeAnnotation:
    base
    + " If this is intentional, add an explicit type to the function or use a disable comment.",
};

const methodsRecords: Record<string, keyof typeof messages> = {
  every: "shouldBeBoolean",
  some: "shouldBeBoolean",
  filter: "shouldBeBoolean",
  find: "shouldBeBoolean",
  findLast: "shouldBeBoolean",
  findLastIndex: "shouldBeBoolean",
  flatMap: "flatMap",
  map: "addTypeAnnotation",
  reduce: "addTypeAnnotation",
  reduceRight: "addTypeAnnotation",
};
const methods = Object.keys(methodsRecords);

export const arrayCallbackReturn = defineRule(() => ({
  name: "arnaudBarre/arrayCallbackReturn",
  visitor: {
    PropertyAccessExpression(context, node) {
      if (
        node.name.kind === SyntaxKind.Identifier
        && methods.includes(node.name.text)
        && node.parent.kind === SyntaxKind.CallExpression
        && node.parent.arguments.length >= 1
      ) {
        const callback = node.parent.arguments[0];
        if (
          callback.kind === SyntaxKind.ArrowFunction
          && callback.body.kind !== SyntaxKind.Block
        ) {
          return;
        }
        const functionType = context.checker.getTypeAtLocation(callback);
        const signatures = functionType.getCallSignatures();
        if (signatures.length === 0) return;

        for (const signature of signatures) {
          const type = signature.getReturnType();
          /* eslint-disable no-bitwise */
          if (
            (type.flags & TypeFlags.Undefined) !== 0
            || (type.isUnion()
              && type.types.some((t) => (t.flags & TypeFlags.Undefined) !== 0))
          ) {
            const messageId = methodsRecords[node.name.text];
            if (
              messageId === "addTypeAnnotation"
              && node.parent.typeArguments
            ) {
              return;
            }
            context.report({ node: node.name, message: messages[messageId] });
          }
        }
      }
    },
  },
}));

export function test() {
  ruleTester({
    ruleFn: arrayCallbackReturn,
    valid: [
      "[0, 1, undefined].map((x) => x)",
      "[0, 1, 2].every((x) => { return x > 0 })",
      "[0, 1, 2, undefined].flatMap((x) => { return typeof x === 'number' ? x : [x] })",
      "[0, 1, 2, undefined].map<number | undefined>((x) => { return x })",
    ],
    invalid: [
      {
        code: `[0, 1, 2].map((x) => { 
  switch (x) {
    case 0:
      return 'zero';
    case 1:
      return 'one';
  }
})
      `,
        error: messages.addTypeAnnotation,
      },
      {
        code: "[0, 1, 2, undefined].some((x) => { return x })",
        error: messages.shouldBeBoolean,
      },
      {
        code: "[{ a: [1] }, { a: [2] }, { a: undefined }].flatMap((x) => { return x.a })",
        error: messages.flatMap,
      },
    ],
  });
}
