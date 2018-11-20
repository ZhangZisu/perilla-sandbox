import { readFileSync } from "fs";
import { IsolateRawRunOptions, IsolateRunConfig } from "./interface";

export const convertName = (name: string) => {
    let ret = "--";
    for (const c of name) {
        if (c === c.toUpperCase()) {
            ret += "-" + c.toLowerCase();
        } else {
            ret += c;
        }
    }
    return ret;
};

export const generateArguments = (options: IsolateRawRunOptions, dirs: string[], envs: string[], program: string, programArguments?: string[]) => {
    const args = [];
    for (const key in options) {
        if (typeof options[key] === "boolean") {
            if (options[key]) { args.push(convertName(key)); }
        } else {
            args.push(convertName(key) + "=" + options[key]);
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

export const parseMetaFile = (path: string) => {
    const content = readFileSync(path).toString();
    const tags = content.split("\n").map((x) => x.trim().split(":"));
    const result = {};
    for (const kv of tags) {
        result[kv[0]] = kv[1];
    }
};
