import {ESLintUtils} from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
    () => 'dv/avoid-short-identifiers',
);

type MessageIds = 'avoidShortIdentifiers';

type Options = [{
    minCharactersCount?: 2 | 3;
}];

const avoidShortIdentifiers = createRule<Options, MessageIds>({
    name: 'avoid-short-identifiers',
    meta: {
        type: 'layout',
        docs: {
            description: 'Enforce avoiding short identifiers',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    minCharactersCount: {
                        type: 'integer',
                        enum: [2, 3],
                        default: 2,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            avoidShortIdentifiers: 'Avoid short identifiers. Minimum characters count is {{minCharactersCount}}',
        },
    },
    defaultOptions: [
        {
            minCharactersCount: 2,
        },
    ],
    create: context => ({
        Identifier: node => {
            const minCharactersCount = context.options[0]?.minCharactersCount || 2;

            if (node.name.length < minCharactersCount) {
                context.report({
                    node,
                    messageId: 'avoidShortIdentifiers',
                    data: {
                        minCharactersCount,
                    }
                });
            }
        },
    }),
});

export default avoidShortIdentifiers;
