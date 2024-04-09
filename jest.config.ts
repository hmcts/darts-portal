import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  transformIgnorePatterns: ['node_modules/(?!@angular|@scottish-government|ngx-cookie-service)'],
  moduleNameMapper: {
    '^@services/(.*)$': [
      '<rootDir>/src/app/core/services/$1',
      '<rootDir>/src/app/portal/services/$1',
      '<rootDir>/src/app/admin/services/$1',
    ],
    '^@common/(.*)$': '<rootDir>/src/app/core/components/common/$1',
    '^@components/(.*)$': ['<rootDir>/src/app/core/components/$1', '<rootDir>/src/app/portal/components/$1'],
    '^@core-types/(.*)$': '<rootDir>/src/app/core/models/$1',
    '^@portal-types/(.*)$': '<rootDir>/src/app/portal/models/$1',
    '^@validators/(.*)$': '<rootDir>/src/app/core/validators/$1',
    '^@pipes/(.*)$': '<rootDir>/src/app/core/pipes/$1',
    '^@interceptors/(.*)$': '<rootDir>/src/app/core/interceptors/$1',
    '^@extensions/(.*)$': '<rootDir>/src/app/core/extensions/$1',
    '^@directives/(.*)$': '<rootDir>/src/app/core/directives/$1',
    '^@constants/(.*)$': ['<rootDir>/src/app/portal/constants/$1', '<rootDir>/src/app/admin/constants/$1'],
  },
};

export default config;
