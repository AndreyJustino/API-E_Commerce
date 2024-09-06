export default {
	collectCoverage: false,
	coverageReporters: ["json", "html"],
	transform: {
		"^.+\\.jsx?$": "babel-jest",
	},
	testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
	moduleFileExtensions: ["js", "jsx"],
};
