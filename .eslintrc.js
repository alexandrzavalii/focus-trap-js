module.exports = {
  env: {
    browser: true,
    commonjs: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  plugins: [
    "prettier"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
  }
}
