/* eslint-disable no-console */
const { PerillaSandbox } = require("../dist");

let sandbox = new PerillaSandbox();

// Compile source code
console.log("C++ compile test");
console.log(sandbox.run({
	memory: 102400,
	time: 5,
	processes: 5,
	shareNet: false,
	mountEtc: false,
	inputFiles: [{ src: "1.cpp", dst: "1.cpp" }],
	outputFiles: [{ src: "1", dst: "1" }],
	executable: "/usr/bin/g++",
	arguments: ["1.cpp", "-o", "1"],
	stdin: null,
	stdout: "compile.out"
}));

// Run source code
console.log("C++ run test");
console.log(sandbox.run({
	memory: 102400,
	time: 5,
	processes: 1,
	shareNet: false,
	mountEtc: false,
	inputFiles: [{ src: "1", dst: "1" }],
	outputFiles: [],
	executable: "./1",
	arguments: [],
	stdin: "test.in",
	stdout: "run.out"
}));

const testCode = (name) => {
	console.log("Test code " + name);
	console.log(sandbox.run({
		memory: 102400,
		time: 5,
		processes: 5,
		shareNet: false,
		mountEtc: false,
		inputFiles: [{ src: name + ".cpp", dst: name + ".cpp" }],
		outputFiles: [{ src: name, dst: name }],
		executable: "/usr/bin/g++",
		arguments: [name + ".cpp", "-o", name],
		stdin: null,
		stdout: name + ".compile.out"
	}));
	console.log(sandbox.run({
		memory: 102400,
		time: 5,
		processes: 1,
		shareNet: false,
		mountEtc: false,
		inputFiles: [{ src: name, dst: name }],
		outputFiles: [],
		executable: "./" + name,
		arguments: [],
		stdin: null,
		stdout: null
	}));
};

testCode("toxic1");
testCode("toxic2");
testCode("ctle2");