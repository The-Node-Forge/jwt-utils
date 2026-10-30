module.exports = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript files
  testEnvironment: 'node', // Use Node.js environment for tests
  moduleFileExtensions: ['ts', 'js'], // Recognize TypeScript and JavaScript files
  testMatch: ['**/tests/**/*.test.ts'], // Match test files
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }, // Resolve NodeNext-style .js imports to .ts sources
  collectCoverageFrom: ['src/**/*.ts', '!src/types/**'], // Include untested files in coverage
  coverageThreshold: {
    global: { statements: 95, branches: 90, functions: 100, lines: 95 },
  },
  verbose: true, // Show detailed test results
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151002], // Suppress TS151002 warning about hybrid module kind
      },
    },
  },
};
