module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin','prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'error'
    ],
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error', //Se encarga de que en las funciones de TS siempre definan el retorno
        '@typescript-eslint/no-explicit-any': 'error', //Se encarga de que en los TS no se implemente el tipo de valor Any
        'one-var-declaration-per-line': ['error', 'always'],
        'for-direction':'error',
        'no-await-in-loop': 'error'
      },
    },
  ],
};
