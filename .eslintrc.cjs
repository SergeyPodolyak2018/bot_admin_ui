module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  settings: {
    'react': {
      'version': 'detect',
    },
    'import/resolver': {
      'typescript': true,
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'moduleDirectory': ['node_modules', 'src/'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react-redux/recommended',
    'prettier',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-refresh', '@typescript-eslint', 'prefer-arrow', 'react-hooks', 'jsx-a11y', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react-refresh/only-export-components': [
      'off',
      { allowConstantExport: true },
    ],
  },
};
