const { PerillaSandbox } = require("../dist");

let sandbox = new PerillaSandbox();

// Compile source code

console.log(sandbox.run({
    memory: 102400,
    time: 5,
    processes: 10,
    shareNet: false,
    mountEtc: false,
    inputFiles: [{ src: '1.cpp', dst: '1.cpp' }],
    outputFiles: [{ src: '1', dst: '1' }],
    executable: '/usr/bin/g++',
    arguments: ['1.cpp', '-o', '1'],
    stdin: null,
    stdout: 'compile.out'
}))

// Run source code

console.log(sandbox.run({
    memory: 102400,
    time: 5,
    processes: 10,
    shareNet: false,
    mountEtc: false,
    inputFiles: [{ src: '1', dst: '1' }],
    outputFiles: [],
    executable: './1',
    arguments: [],
    stdin: 'test.in',
    stdout: 'run.out'
}))

// Run toxic code 1

