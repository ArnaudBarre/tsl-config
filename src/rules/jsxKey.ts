import { type AST, type Context, defineRule } from "tsl";
import { ruleTester } from "tsl/ruleTester";
import { SyntaxKind } from "typescript";

const reactComponentNameRE = /^[A-Z][a-zA-Z0-9]*$/u;

const messages = {
  missingKey: "Missing key",
  keyFirst: "Key should be first",
  keySpread: "Key should not be spread",
  keyInProps: '"key" can\'t be part of props',
};

export const jsxKey = defineRule(() => {
  const reportFragment = (node: AST.JsxFragment, context: Context) => {
    context.report({
      message: messages.missingKey,
      node: node.openingFragment,
    });
  };
  const checkElement = (
    node: AST.JsxElement | AST.JsxSelfClosingElement,
    context: Context,
  ) => {
    const openingElement =
      node.kind === SyntaxKind.JsxElement ? node.openingElement : node;
    let keyAttr: { index: number; node: AST.JsxAttribute } | undefined;
    for (const [
      index,
      attr,
    ] of openingElement.attributes.properties.entries()) {
      if (
        attr.kind === SyntaxKind.JsxAttribute
        && attr.name.kind === SyntaxKind.Identifier
        && attr.name.text === "key"
      ) {
        keyAttr = { index, node: attr };
      }
      if (attr.kind === SyntaxKind.JsxSpreadAttribute) {
        const type = context.checker.getTypeAtLocation(attr.expression);
        if (type.getProperty("key")) {
          context.report({ message: messages.keySpread, node: attr });
        }
      }
    }
    if (keyAttr) {
      if (keyAttr.index !== 0) {
        context.report({ message: messages.keyFirst, node: keyAttr.node });
      }
    } else {
      context.report({ message: messages.missingKey, node: openingElement });
    }
  };
  const checkExpression = (node: AST.Expression, context: Context) => {
    switch (node.kind) {
      case SyntaxKind.JsxElement:
        checkElement(node, context);
        break;
      case SyntaxKind.JsxSelfClosingElement:
        checkElement(node, context);
        break;
      case SyntaxKind.JsxFragment:
        reportFragment(node, context);
        break;
      case SyntaxKind.ConditionalExpression:
        checkExpression(node.whenTrue, context);
        checkExpression(node.whenFalse, context);
        break;
      case SyntaxKind.BinaryExpression:
        checkExpression(node.left, context);
        checkExpression(node.right, context);
        break;
      case SyntaxKind.ParenthesizedExpression:
      case SyntaxKind.SatisfiesExpression:
      case SyntaxKind.TypeAssertionExpression:
      case SyntaxKind.NonNullExpression:
      case SyntaxKind.AsExpression:
        checkExpression(node.expression, context);
        break;
      default:
        break;
    }
  };
  const checkStatement = (node: AST.Statement, context: Context) => {
    switch (node.kind) {
      case SyntaxKind.Block:
        for (const statement of node.statements)
          checkStatement(statement, context);
        break;
      case SyntaxKind.ReturnStatement:
        if (node.expression) checkExpression(node.expression, context);
        break;
      case SyntaxKind.ExpressionStatement:
        checkExpression(node.expression, context);
        break;
      case SyntaxKind.IfStatement:
        checkStatement(node.thenStatement, context);
        if (node.elseStatement) checkStatement(node.elseStatement, context);
        break;
      case SyntaxKind.SwitchStatement:
        for (const caseClause of node.caseBlock.clauses) {
          for (const statement of caseClause.statements) {
            checkStatement(statement, context);
          }
        }
        break;
      default:
        break;
    }
  };
  const checkIfReactComponentWithKeyInProps = (
    id: AST.Identifier,
    fnNode: AST.FunctionDeclaration | AST.ArrowFunction,
    context: Context,
  ) => {
    if (!reactComponentNameRE.test(id.text)) return;
    if (fnNode.parameters.length === 0) return;
    const type = context.checker.getTypeAtLocation(fnNode.parameters[0]);
    if (type.getProperty("key")) {
      context.report({ message: messages.keyInProps, node: id });
    }
  };

  return {
    name: "arnaudBarre/jsxKey",
    visitor: {
      JsxElement(context, node) {
        if (node.parent.kind === SyntaxKind.ArrayLiteralExpression) {
          checkElement(node, context);
        }
      },
      JsxSelfClosingElement(context, node) {
        if (node.parent.kind === SyntaxKind.ArrayLiteralExpression) {
          checkElement(node, context);
        }
      },
      JsxFragment(context, node) {
        if (node.parent.kind === SyntaxKind.ArrayLiteralExpression) {
          reportFragment(node, context);
        }
      },
      CallExpression(context, node) {
        if (
          node.expression.kind === SyntaxKind.PropertyAccessExpression
          && node.expression.name.kind === SyntaxKind.Identifier
          && (node.expression.name.text === "map"
            || node.expression.name.text === "mapNotNull")
        ) {
          const firstArg = node.arguments.at(0);
          if (firstArg?.kind !== SyntaxKind.ArrowFunction) return;

          if (firstArg.body.kind === SyntaxKind.Block) {
            checkStatement(firstArg.body, context);
          } else {
            checkExpression(firstArg.body, context);
          }
        }
      },
      VariableDeclaration(context, node) {
        if (node.initializer?.kind !== SyntaxKind.ArrowFunction) return;
        if (node.name.kind !== SyntaxKind.Identifier) return;
        checkIfReactComponentWithKeyInProps(
          node.name,
          node.initializer,
          context,
        );
      },
      FunctionDeclaration(context, node) {
        if (!node.name) return;
        checkIfReactComponentWithKeyInProps(node.name, node, context);
      },
    },
  };
});

export function test() {
  ruleTester({
    ruleFn: jsxKey,
    valid: [
      {
        tsx: true,
        code: "bar.map(el => <Bar key={el.id} baz={2} />)",
      },
      {
        tsx: true,
        code: "[{ id: 1 }].map(el => <Bar key={el.id} {...el} />)",
      },
      {
        tsx: true,
        code: "[{ key: 1, foo: 2 }].map(({ key, ...rest }) => <Bar key={key} {...rest} />)",
      },
      {
        tsx: true,
        code: `export const Foo = ({ foo }: Omit<{ key: string; foo: number }, "key">) => (
          <Bar key={foo} foo={foo} />
        )`,
      },
      {
        tsx: true,
        code: `export function Foo({ foo }: Omit<{ key: string; foo: number }, "key">) {
          return <Bar key={foo} foo={foo} />
        }`,
      },
    ],
    invalid: [
      {
        tsx: true,
        code: "bar.map(el => <Bar id={el.id} />)",
        error: messages.missingKey,
      },
      {
        tsx: true,
        code: "bar.mapNotNull(el => el ? <Bar id={el.id} /> : null)",
        error: messages.missingKey,
      },
      {
        tsx: true,
        code: `bar.mapNotNull(el => {
          switch (el.type) {
            case "BAZ": {
              if (el.foo !== 0) return <Bar id={el.id} />
            }
          }
        })`,
        error: messages.missingKey,
      },
      {
        tsx: true,
        code: `bar.mapNotNull(el => {
          if (el.foo === 0) return null
          else return el.content ?? <Bar id={el.id} /> 
        })`,
        error: messages.missingKey,
      },
      {
        tsx: true,
        code: "bar.map(el => <><Bar key={el.id} /></>)",
        error: messages.missingKey,
      },
      {
        tsx: true,
        code: "bar.map(el => <Bar baz={2} key={el.id}  />)",
        error: messages.keyFirst,
      },
      {
        tsx: true,
        code: "[{ key: 1, foo: 2 }].map(el => <Bar {...el} />)",
        errors: [
          { message: messages.keySpread },
          { message: messages.missingKey },
        ],
      },
      {
        tsx: true,
        code: `export const Foo = ({ key, foo }: { key: string; foo: number }) => (
          <Bar key={key} foo={foo} />
        )`,
        error: messages.keyInProps,
      },
      {
        tsx: true,
        code: `export function Foo({ key, foo }: { key: string; foo: number }) {
          return <Bar key={key} foo={foo} />
        }`,
        error: messages.keyInProps,
      },
      {
        tsx: true,
        code: `export function Foo() {
          return <>{admin && data.slice(0, 10).map(el => (<Bar value={el} />))}</>
        }`,
        error: messages.missingKey,
      },
    ],
  });
}
