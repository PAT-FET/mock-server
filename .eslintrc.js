module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
  },
  'extends': [
    'standard'
  ],
  parserOptions: {
    "ecmaVersion": 2018,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-infix-ops': 'off'
  }
}
