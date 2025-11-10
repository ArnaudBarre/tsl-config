import { core, createRulesSet } from "tsl";
import { arrayCallbackReturn } from "./rules/arrayCallbackReturn.ts";
import { jsxFragmentCheckChildren } from "./rules/jsxFragmentCheckChildren.ts";
import { jsxKey } from "./rules/jsxKey.ts";
import { jsxNoNumberTruthiness } from "./rules/jsxNoNumberTruthiness.ts";

export const arnaudBarre = createRulesSet({
  arrayCallbackReturn,
  jsxFragmentCheckChildren,
  jsxKey,
  jsxNoNumberTruthiness,
});

export const allRules = [
  ...core.all(),
  core.preferNullishCoalescing({ ignoreIfStatements: true }),
  core.noMisusedPromises({
    checksConditionals: false,
    checksVoidReturn: { arguments: false, attributes: false },
  }),
  core.noConfusingVoidExpression({ ignoreArrowShorthand: true }),
  core.noUnnecessaryCondition({
    allowConstantLoopConditions: "only-allowed-literals",
    checkTypePredicates: true,
  }),
  core.switchExhaustivenessCheck({
    allowDefaultCaseForExhaustiveSwitch: false,
    considerDefaultExhaustiveForUnions: true,
  }),
  core.strictBooleanExpressions({
    allowAny: false,
    allowNullableBoolean: true,
    allowNullableEnum: true,
    allowNullableNumber: true,
    allowNullableObject: true,
    allowNullableString: true,
    allowNumber: false,
    allowString: false,
  }),
  ...arnaudBarre.all(),
];
