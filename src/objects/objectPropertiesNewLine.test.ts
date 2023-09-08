import {RuleTester} from '@typescript-eslint/rule-tester';
import rule from './objectPropertiesNewLine';

const ruleTester = new RuleTester({
    parser: '@typescript-eslint/parser',
});

const validObjectTwoProperties = 'const obj = {\na: 1,\nb: 2,\n};';
const validObjectThreeProperties = 'const obj = {\na: 1,\nb: 2,\nc: 3,\n};';
const validDesctructuringTwoProperties = 'const {\na,\nb,\n} = obj;';
const validDesctructuringThreeProperties = 'const {\na,\nb,\nc,\n} = obj;';
const validImportTwoProperties = 'import {\na,\nb,\n} from "b";';
const validImportThreeProperties = 'import {\na,\nb,\nc,\n} from "b";';
const validExportTwoProperties = 'export {\na,\nb,\n} from "b";';
const validExportThreeProperties = 'export {\na,\nb,\nc,\n} from "b";';

ruleTester.run('object-properties-new-line', rule, {
    valid: [
        'const obj = {a: 1, b: 2};',
        validObjectTwoProperties,
        validObjectThreeProperties,
        'const {a} = obj;',
        'const {a, b} = obj;',
        validDesctructuringTwoProperties,
        validDesctructuringThreeProperties,
        'import {a} from "b";',
        'import {a, b} from "b";',
        validImportTwoProperties,
        validImportThreeProperties,
        'export {a} from "b";',
        'export {a, b} from "b";',
        validExportTwoProperties,
        validExportThreeProperties,
    ],
    invalid: [
        {
            code: 'const obj = {\na: 1,b: 2};',
            output:'const obj = {\na: 1,\nb: 2,\n};',
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const obj = {\na: 1, b: 2\n};',
            output: validObjectTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const obj = {\na: 1, b: 2, c: 3};',
            output:  validObjectThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const obj = {\na: 1, b: 2, c: 3\n};',
            output:  validObjectThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const obj = {\na: 1, \nb: 2, c: 3\n};',
            output:  validObjectThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const obj = {\na: 1, b: 2,\nc: 3\n};',
            output:  validObjectThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const {\na, b} = obj;',
            output: validDesctructuringTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const {a, b\n} = obj;',
            output: validDesctructuringTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const {\na, b\n} = obj;',
            output: validDesctructuringTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const {\na, b, c} = obj;',
            output: validDesctructuringThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const {\na, b, c\n} = obj;',
            output: validDesctructuringThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const {\na, b,\nc\n} = obj;',
            output: validDesctructuringThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'const {\na, b,\nc} = obj;',
            output: validDesctructuringThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'import {\na, b} from "b";',
            output: validImportTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'import {\na, b as importB} from "b";',
            output: 'import {\na,\nb as importB,\n} from "b";',
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'import {\na, b\n} from "b";',
            output: validImportTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'import {\na, b\n} from "b";',
            output: validImportTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'import {\na, b, c} from "b";',
            output: validImportThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'import {\na, b, c\n} from "b";',
            output: validImportThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'import {\na, b,\nc\n} from "b";',
            output: validImportThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'import {\na, b,\nc} from "b";',
            output: validImportThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'export {\na, b} from "b";',
            output: validExportTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'export {\na, b\n} from "b";',
            output: validExportTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'export {\na, b\n} from "b";',
            output: validExportTwoProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'export {\na, b, c} from "b";',
            output: validExportThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'export {\na, b, c\n} from "b";',
            output: validExportThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'export {\na, b,\nc\n} from "b";',
            output: validExportThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
        {
            code: 'export {\na, b,\nc} from "b";',
            output: validExportThreeProperties,
            errors: [{
                messageId: 'objectPropertiesNewLine',
            }]
        },
    ],
});
