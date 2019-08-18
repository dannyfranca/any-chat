module.exports = {
  // testEnvironment: 'node',
  preset: "jest-puppeteer",
  setupFilesAfterEnv: ["jest-extended", "expect-puppeteer"],
  testMatch: ['<rootDir>/test/**/*.test.{js,ts}'],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,ts}'
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
}
