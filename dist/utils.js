"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.convertJsNameToIsolate = (name) => {
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
exports.convertIsolateNameToJs = (name) => {
    const splitted = name.split("-");
    let ret = splitted[0];
    for (let i = 1; i < splitted.length; i++) {
        ret += splitted[i][0].toUpperCase() + splitted[i].substr(1);
    }
    return ret;
};
exports.parseMetaFile = (path) => {
    const content = fs_1.readFileSync(path).toString();
    const tags = content.split("\n").map((x) => x.trim().split(":"));
    const result = {};
    for (const kv of tags) {
        const key = exports.convertIsolateNameToJs(kv[0]);
        if (key && key.length) {
            result[key] = kv[1];
        }
    }
    return result;
};
//# sourceMappingURL=utils.js.map