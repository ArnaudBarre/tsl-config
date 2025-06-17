import { core, createRulesSet } from "@arnaud-barre/type-lint";
import { arrayCallbackReturn } from "./rules/arrayCallbackReturn";
import { jsxKey } from "./rules/jsxKey";
import { jsxNoNumberTruthiness } from "./rules/jsxNoNumberTruthiness";

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
  ...arnaudBarre.all(),
];
