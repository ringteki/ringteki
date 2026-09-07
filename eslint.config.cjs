const js = require('@eslint/js');
const jasmine = require('eslint-plugin-jasmine');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const globals = require('globals');

module.exports = [
    {
        ignores: ['build/**', 'node_modules/**', 'coverage/**']
    },
    js.configs.recommended,
    // Disable new ESLint 10 rules that flag many existing patterns — enable later
    {
        rules: {
            'no-useless-assignment': 'off',
            'preserve-caught-error': 'off'
        }
    },
    // JavaScript files
    {
        files: ['**/*.js'],
        plugins: {
            jasmine
        },
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2020,
                ...globals.jasmine
            }
        },
        rules: {
            // Jasmine rules
            'jasmine/no-spec-dupes': 'off',
            'jasmine/no-suite-dupes': 'off',
            'jasmine/missing-expect': 'warn',
            'jasmine/new-line-before-expect': 'off',
            'jasmine/prefer-toHaveBeenCalledWith': 'off',

            // Code style rules
            'indent': ['error', 4, { SwitchCase: 1 }],
            'quotes': ['error', 'single'],
            'brace-style': ['error', '1tbs'],
            'no-sparse-arrays': 'warn',
            'eqeqeq': 'error',
            'no-else-return': 'error',
            'no-extra-bind': 'error',
            'curly': ['error', 'all'],
            'no-multi-spaces': 'error',
            'no-invalid-this': 'error',
            'no-useless-escape': 'warn',
            'no-useless-concat': 'warn',
            'no-useless-constructor': 'warn',
            'array-bracket-spacing': ['warn', 'never'],
            'block-spacing': ['error', 'always'],
            'camelcase': ['error', { properties: 'never' }],
            'comma-dangle': 'error',
            'space-before-blocks': 'error',
            'space-in-parens': ['error', 'never'],
            'space-infix-ops': 'error',
            'no-multiple-empty-lines': 'error',
            'eol-last': 'error',
            'semi': 'error',
            'keyword-spacing': ['error', {
                overrides: {
                    if: { after: false },
                    for: { after: false },
                    while: { after: false },
                    switch: { after: false },
                    catch: { after: false }
                }
            }],
            'no-trailing-spaces': 'error',
            'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }]
        }
    },
    // TypeScript source files (with type checking)
    {
        files: ['server/**/*.ts'],
        plugins: {
            '@typescript-eslint': tseslint,
            jasmine
        },
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parser: tsparser,
            parserOptions: {
                project: './tsconfig.json'
            },
            globals: {
                ...globals.node,
                ...globals.es2020,
                ...globals.jasmine
            }
        },
        rules: {
            // TypeScript rules (disabled for gradual migration — re-enable as codebase improves)
            ...tseslint.configs.recommended.rules,
            'no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/ban-ts-comment': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/no-empty-object-type': 'error',
            '@typescript-eslint/no-unsafe-function-type': 'error',
            '@typescript-eslint/no-duplicate-enum-values': 'error',
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/no-this-alias': 'error',
            'no-redeclare': 'off',

            // Jasmine rules
            'jasmine/no-spec-dupes': 'off',
            'jasmine/no-suite-dupes': 'off',
            'jasmine/missing-expect': 'warn',
            'jasmine/new-line-before-expect': 'off',
            'jasmine/prefer-toHaveBeenCalledWith': 'off',

            // Code style rules
            'indent': ['error', 4, { SwitchCase: 1 }],
            'quotes': ['error', 'single'],
            'brace-style': ['error', '1tbs'],
            'no-sparse-arrays': 'warn',
            'eqeqeq': 'error',
            'no-else-return': 'error',
            'no-extra-bind': 'error',
            'curly': ['error', 'all'],
            'no-multi-spaces': 'error',
            'no-useless-escape': 'warn',
            'no-useless-concat': 'warn',
            'array-bracket-spacing': ['warn', 'never'],
            'block-spacing': ['error', 'always'],
            'camelcase': ['error', { properties: 'never' }],
            'comma-dangle': 'error',
            'space-before-blocks': 'error',
            'space-in-parens': ['error', 'never'],
            'space-infix-ops': 'error',
            'no-multiple-empty-lines': 'error',
            'eol-last': 'error',
            'semi': 'error',
            'keyword-spacing': ['error', {
                overrides: {
                    if: { after: false },
                    for: { after: false },
                    while: { after: false },
                    switch: { after: false },
                    catch: { after: false }
                }
            }],
            'no-trailing-spaces': 'error'
        }
    },
    // TypeScript test files (without type checking project)
    {
        files: ['test/**/*.ts'],
        plugins: {
            '@typescript-eslint': tseslint,
            jasmine
        },
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parser: tsparser,
            globals: {
                ...globals.node,
                ...globals.es2020,
                ...globals.jasmine,
                integration: 'readonly',
                fillers: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            'camelcase': ['error', { properties: 'never' }],
            'no-invalid-this': 'off'
        }
    },
    // JavaScript test files - relaxed rules
    {
        files: ['test/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jasmine,
                integration: 'readonly',
                fillers: 'readonly'
            }
        },
        rules: {
            'camelcase': ['error', { properties: 'never' }],
            'no-invalid-this': 'off'
        }
    }
];
