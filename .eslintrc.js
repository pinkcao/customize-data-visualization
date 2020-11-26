module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  plugins: ['vue'],
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    // 'space-before-function-paren': 0,
    // "space-before-function-paren": ["error", "always"],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'space-before-function-paren': ["error", "always"],
    // 'space-before-function-paren': [
    //   'error',
    //   {
    //     anonymous: 'always',
    //     named: 'never',
    //     asyncArrow: 'never'
    //   }
    // ],
    semi: 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
