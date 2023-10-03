import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  transformIgnorePatterns: ['node_modules/(?!@angular|@scottish-government)'],
  moduleNameMapper: {
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@common/(.*)$': '<rootDir>/src/app/components/common/$1',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@darts-types/(.*)$': '<rootDir>/src/app/types/$1',
    '^@validators/(.*)$': '<rootDir>/src/app/validators/$1',
    '^@pipes/(.*)$': '<rootDir>/src/app/pipes/$1',
    '^@interceptors/(.*)$': '<rootDir>/src/app/interceptors/$1',
    '^@extensions/(.*)$': '<rootDir>/src/app/extensions/$1',
    '^@directives/(.*)$': '<rootDir>/src/app/directives/$1',
  },
};

export default config;
