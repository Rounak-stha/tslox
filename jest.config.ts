import type { Config } from 'jest'

const config: Config = {
	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

	// An array of regexp pattern strings used to skip coverage collection
	// coveragePathIgnorePatterns: [
	//   "\\\\node_modules\\\\"
	// ],

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: 'v8',

	// A preset that is used as a base for Jest's configuration
	preset: 'ts-jest',
	testEnvironment: 'node'
}

export default config
