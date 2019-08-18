module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json"
  },
  env: {
    jest: true,
  },
  globals: {
    PATH: true,
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true
  }
}
