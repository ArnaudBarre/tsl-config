import { core, createRulesSet } from "tsl";
import { arrayCallbackReturn } from "./rules/arrayCallbackReturn.ts";
import { jsxKey } from "./rules/jsxKey.ts";
import { jsxNoNumberTruthiness } from "./rules/jsxNoNumberTruthiness.ts";

export const arnaudBarre = createRulesSet({
  arrayCallbackReturn,
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
    allowNullableString: true,
    allowNullableBoolean: true,
  }),
  ...arnaudBarre.all(),
];
