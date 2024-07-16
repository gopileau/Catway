module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transform .js and .jsx files using babel-jest
  },
  transformIgnorePatterns: [
    '/node_modules/(?!bson)', // Don't ignore transformation for bson
  ],
};

















  