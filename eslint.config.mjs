import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/** Flat ESLint config — TypeScript sources + tests */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', 'coverage/**', 'data/**', 'storage/**'],
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off', // Express Request augmentation
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': 'warn',
      'no-control-regex': 'off',
    },
  },
);
