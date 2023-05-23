module.exports = {
    plugins: [
        'filenames',
        'no-loops',
        'promise',
    ],
    rules: {
        'filenames/match-regex': [2, '^([0-9a-z-]+)|([a-z-]+.spec)$', true],
        'global-require': 0,
        'no-console': 0,
        'max-len': 'off',
        'no-underscore-dangle': [2, { allow: ['_id', '_parsedOriginalUrl', '_parsedUrl'] }],
        'linebreak-style': 0,
        semi: ['error', 'always'],
        'no-loops/no-loops': 1,
        'object-curly-newline': ['error', {
            ObjectExpression: {
                minProperties: 2,
                multiline: true,
                consistent: true
            },
            ObjectPattern: {
                minProperties: 2,
                multiline: true,
                consistent: true
            },
            ImportDeclaration: {
                minProperties: 2,
                multiline: true, consistent: true
            },
            ExportDeclaration: {
                minProperties: 2,
                multiline: true,
                consistent: true
            },
        }],
    },
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
    ignorePatterns: ['.eslintrc.js']
};
