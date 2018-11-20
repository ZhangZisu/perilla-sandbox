import { IsolateRawRunConfig, IsolateRunConfig } from "./interface";

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

export const generateArguments = (options: IsolateRawRunConfig, dirs: string[], envs: string[], program: string, programArguments: string[]) => {
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
    args.push("--");
    for (const arg of programArguments) {
        args.push(arg);
    }
    return args;
};

export const generateRawConfig = (config: IsolateRunConfig) => {
    const raw: IsolateRawRunConfig = {
        //
    };
};
