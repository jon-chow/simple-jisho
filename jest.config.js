const nextJest = require('next/jest');


const moduleNameMapper = {
	'^@src/(.*)$': '<rootDir>/src/$1',
	'^@public/(.*)$': '<rootDir>/public/$1',
}

const customJestConfig = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleDirectories: ["node_modules", "<rootDir>/"],
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: moduleNameMapper,
};

const createJestConfig = nextJest({
	dir: "./",
	transform: {
		'^.+\\.svg$': 'jest-svg-transformer',
	}
});

module.exports = createJestConfig(customJestConfig);
