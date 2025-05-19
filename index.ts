import { allRules as allCoreRules } from "@arnaud-barre/type-lint/allRules";

export const allRules = [
  allCoreRules({
    "core/awaitThenable": "on",
    "core/dotNotation": "on",
    "core/noArrayDelete": "on",
    "core/noConfusingVoidExpression": { ignoreArrowShorthand: true },
    "core/noFloatingPromises": "on",
    "core/noForInArray": "on",
    "core/noImpliedEval": "on",
    "core/noMeaninglessVoidOperator": "on",
    "core/noMisusedPromises": {
      checksVoidReturn: { arguments: false, attributes: false },
    },
    "core/noMisusedSpread": "on",
    "core/noRedundantTypeConstituents": "on",
    "core/noUnnecessaryCondition": "on",
    "core/noUnnecessaryTemplateExpression": "on",
    "core/noUnnecessaryTypeArguments": "on",
    "core/noUnnecessaryTypeAssertion": "on",
    "core/noUnsafeUnaryMinus": "on",
    "core/nonNullableTypeAssertionStyle": "on",
    "core/onlyThrowError": "on",
    "core/preferFind": "on",
    "core/preferIncludes": "on",
    "core/preferNullishCoalescing": "on",
    "core/preferOptionalChain": "on",
    "core/preferReduceTypeParameter": "on",
    "core/preferReturnThisType": "on",
    "core/preferStringStartsEndsWith": "on",
    "core/restrictPlusOperands": "on",
    "core/restrictTemplateExpressions": "on",
    "core/returnAwait": "on",
    "core/switchExhaustivenessCheck": {
      considerDefaultExhaustiveForUnions: true,
    },
  }),
];
