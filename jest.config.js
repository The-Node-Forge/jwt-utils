module.exports = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript files
  testEnvironment: 'node', // Use Node.js environment for tests
  moduleFileExtensions: ['ts', 'js'], // Recognize TypeScript and JavaScript files
  testMatch: ['**/tests/**/*.test.ts'], // Match test files
  verbose: true, // Show detailed test results
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151002], // Suppress TS151002 warning about hybrid module kind
      },
    },
  },
};
