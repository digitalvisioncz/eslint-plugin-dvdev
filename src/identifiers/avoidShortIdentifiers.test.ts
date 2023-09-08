import {RuleTester} from '@typescript-eslint/rule-tester';
import rule from './avoidShortIdentifiers';

const ruleTester = new RuleTester({
    parser: '@typescript-eslint/parser',
});

ruleTester.run('avoid-short-identifiers', rule, {
    valid: [
        'const abc = 1;',
        {
            code: 'const ab = 1;',
            options: [{minCharactersCount: 2}],
        },
        {
            code: 'const abc = 1;',
            options: [{minCharactersCount: 3}],
        },
    ],
    invalid: [
        {
            code: 'const a = 1;',
            errors: [{
                messageId: 'avoidShortIdentifiers',
                data: {
                    minCharactersCount: 2,
                }
            }]
        },
        {
            code: 'const ab = 1;',
            options: [{minCharactersCount: 3}],
            errors: [{
                messageId: 'avoidShortIdentifiers',
                data: {
                    minCharactersCount: 3,
                }
            }]
        },
    ],
});
