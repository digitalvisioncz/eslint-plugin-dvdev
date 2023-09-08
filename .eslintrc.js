module.exports = {
    extends: ['@dvdevcz/eslint-config-typescript'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
};
