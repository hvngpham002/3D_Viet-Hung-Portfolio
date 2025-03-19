export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
      ['\\.(css|less|scss|sass)$']: 'identity-obj-proxy',
      ['\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$']: '<rootDir>/src/__mocks__/fileMock.ts',
      ['^three/examples/jsm/(.*)$']: '<rootDir>/node_modules/three/examples/jsm/$1'
    },
    transform: {
      ['^.+\\.(ts|tsx)$']: ['ts-jest', {
        tsconfig: 'tsconfig.json',
      }],
    },
    transformIgnorePatterns: [
      'node_modules/(?!(three|@react-three|@react-spring)/)'
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
    ]
  };