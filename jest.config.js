"use strict";

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: "ts-jest",
    testEnvironment: 'node',
    transform: {
        "^.+\\.ts$": [
            "ts-jest"
        ],
        "^.+\\.js$": [
            "esbuild-jest"
        ],
    },
    coverageDirectory: "./.coverage",
    collectCoverageFrom: [
        "./src/**/*.ts"
    ],
    modulePathIgnorePatterns: [
        "/\.work/"
    ],
    coveragePathIgnorePatterns: [
        "/tests/"
    ]
};
