module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Inclure .ts et .tsx en plus de .js et .jsx
  },
  transformIgnorePatterns: [
    '/node_modules/(?!bson)', // Ne pas ignorer la transformation pour bson
  ],
};
















  