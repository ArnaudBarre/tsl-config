import { type AST, defineRule } from "tsl";
import { ruleTester } from "tsl/ruleTester";
import { JsxEmit, type Program, type Symbol, SyntaxKind } from "typescript";

const message =
  "Children doesn't match ReactNode type. See https://github.com/microsoft/TypeScript/issues/62358";

export const jsxFragmentCheckChildren = defineRule(() => ({
  name: "arnaudBarre/jsxFragmentCheckChildren",
  visitor: {
    JsxFragment(context, node) {
      if (context.compilerOptions.jsx !== JsxEmit.ReactJSX) return;
      const reactNodeSymbol = getReactNodeSymbol(context.program);
      const reactNodeType = reactNodeSymbol
        ? context.checker.getDeclaredTypeOfSymbol(reactNodeSymbol)
        : undefined;
      if (!reactNodeType) {
        context.report({
          node,
          message: "Can't resolve ReactNode type. Is @types/react installed?",
        });
        return;
      }

      for (const child of node.children) {
        if (child.kind !== SyntaxKind.JsxExpression) continue;
        if (!child.expression) continue;
        const type = context.checker.getTypeAtLocation(child.expression);
        if (!context.checker.isTypeAssignableTo(type, reactNodeType)) {
          context.report({ node: child, message });
        }
      }
    },
  },
}));

// For some reason I don't yet understand, caching the type leads
// to false positives in the editor, but caching the symbol works
const weekMap: WeakMap<Program, Symbol> = new WeakMap();
function getReactNodeSymbol(program: Program) {
  if (weekMap.has(program)) return weekMap.get(program);

  const reactSourceFile = (
    program.getSourceFiles() as unknown as AST.SourceFile[]
  ).find((sf) => sf.fileName.includes("@types/react/index.d.ts"));
  if (!reactSourceFile) return;
  const namespace = reactSourceFile.statements.find(
    (s) => s.kind === SyntaxKind.ModuleDeclaration,
  );
  if (!namespace) return;
  if (namespace.body?.kind !== SyntaxKind.ModuleBlock) return;
  const statement = namespace.body.statements.find(
    (s): s is AST.TypeAliasDeclaration =>
      s.kind === SyntaxKind.TypeAliasDeclaration
      && s.name.getText() === "ReactNode",
  );
  if (!statement) return;
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(statement.name);
  if (!symbol) return;
  weekMap.set(program, symbol);
  return symbol;
}

export function test() {
  ruleTester({
    ruleFn: jsxFragmentCheckChildren,
    valid: [
      {
        tsx: true,
        code: "const loading: boolean | undefined; <>{loading && 'Ok'}</>",
      },
      {
        tsx: true,
        code: "const list = [1, '2', false]; <>{list}</>",
      },
    ],
    invalid: [
      {
        tsx: true,
        code: "const obj = { foo: 'bar' }; <>{obj}</>",
        error: message,
      },
      {
        tsx: true,
        code: "const array = [{ foo: 'bar' }]; <>{array}</>",
        error: message,
      },
    ],
  });
}
