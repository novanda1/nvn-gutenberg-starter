module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['wordpress', 'standard'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  ignorePatterns: ['dist/**/*.js'],
  rules: {
    'space-before-function-paren': [2, { anonymous: 'always', named: 'never' }]
  },
  plugins: ['prettier']
}
