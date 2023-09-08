import avoidShortIdentifiers from './identifiers/avoidShortIdentifiers';
import objectPropertiesNewLine from './objects/objectPropertiesNewLine';

const rules = {
    'avoid-short-identifiers': avoidShortIdentifiers,
    'object-properties-new-line': objectPropertiesNewLine,
};

const configs = {
    recommended: {
        plugins: [
          'dv',
        ],
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
        rules: {
            'dv/object-properties-new-line': 'error',
            'dv/avoid-short-identifiers': ['error', {minCharacterCount: 3}],
        },
    }
};

export = {
    rules,
    configs
};
