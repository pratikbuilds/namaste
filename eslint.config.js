const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

const strictExpoConfig = expoConfig.map((config) => {
  if (config.plugins?.['@typescript-eslint']) {
    return {
      ...config,
      rules: {
        ...config.rules,
        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
        ],
      },
    };
  }

  if (config.plugins?.import) {
    return {
      ...config,
      rules: {
        ...config.rules,
        'import/no-cycle': 'error',
      },
    };
  }

  if (config.plugins?.react) {
    return {
      ...config,
      rules: {
        ...config.rules,
        'react/display-name': 'off',
        'react/jsx-boolean-value': ['error', 'never'],
        'react/no-unstable-nested-components': 'error',
      },
    };
  }

  return config;
});

module.exports = defineConfig([
  strictExpoConfig,
  {
    ignores: [
      '.expo/**',
      '.github/**',
      'android/**',
      'ios/**',
      'dist/**',
      'node_modules/**',
      'web-build/**',
    ],
  },
  {
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['SafeAreaView'],
              message: 'Use react-native-safe-area-context or navigator-managed safe areas.',
            },
            {
              name: 'react-native',
              importNames: ['Dimensions'],
              message: 'Use useWindowDimensions for responsive native layouts.',
            },
          ],
        },
      ],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
]);
