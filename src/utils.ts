import { readFileSync } from "fs";
import { IRunConfig, IsolateRawRunOptions } from "./interface";

export const convertJsNameToIsolate = (name: string) => {
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

export const convertIsolateNameToJs = (name: string) => {
    const splitted = name.split("-");
    let ret = splitted[0];
    for (let i = 1; i < splitted.length; i++) {
        ret += splitted[i][0].toUpperCase() + splitted[i].substr(1);
    }
    return ret;
};

export const parseMetaFile = (path: string): any => {
    const content = readFileSync(path).toString();
    const tags = content.split("\n").map((x) => x.trim().split(":"));
    const result: any = {};
    for (const kv of tags) {
        const key = convertIsolateNameToJs(kv[0]);
        if (key && key.length) { result[key] = kv[1]; }
    }
    return result;
};
