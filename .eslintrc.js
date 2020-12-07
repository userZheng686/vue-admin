module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    "no-console":"off",//在这禁止掉console报错检查
　　"no-irregular-whitespace":"off"//这禁止掉 空格报错检查
  }
}
