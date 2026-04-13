import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    'src/models/**/*.ts',
    'src/middlewares/**/*.ts',
    'src/routes/**/*.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts']
};

export default config;
