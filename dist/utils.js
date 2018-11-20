"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.convertName = (name) => {
    let ret = "--";
    for (const c of name) {
        if (c === c.toUpperCase()) {
            ret += "-" + c.toLowerCase();
        }
        else {
            ret += c;
        }
    }
    return ret;
};
exports.generateArguments = (options, dirs, envs, program, programArguments) => {
    const args = [];
    for (const key in options) {
        if (typeof options[key] === "boolean") {
            if (options[key]) {
                args.push(exports.convertName(key));
            }
        }
        else {
            args.push(exports.convertName(key) + "=" + options[key]);
        }
    }
    for (const dir of dirs) {
        args.push("--dir=" + dir);
    }
    for (const env of envs) {
        args.push("--env=" + env);
    }
    args.push("--run");
    args.push(program);
    if (programArguments) {
        args.push("--");
        for (const arg of programArguments) {
            args.push(arg);
        }
    }
    return args;
};
exports.parseMetaFile = (path) => {
    const content = fs_1.readFileSync(path).toString();
    const tags = content.split("\n").map((x) => x.trim().split(":"));
    const result = {};
    for (const kv of tags) {
        result[kv[0]] = kv[1];
    }
};
//# sourceMappingURL=utils.js.map