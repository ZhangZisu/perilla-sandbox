"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const interface_1 = require("./interface");
const utils_1 = require("./utils");
class PerillaSandbox {
    constructor(isolateExecutable = "/usr/local/bin/isolate", boxID = 0, wallDelta = 0, wallMultiplier = 1, extraDelta = 0, extraMultiplier = 1, env = ["PATH=/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin"]) {
        this.isolateExecutable = isolateExecutable;
        this.boxID = boxID;
        this.wallDelta = wallDelta;
        this.wallMultiplier = wallMultiplier;
        this.extraDelta = extraDelta;
        this.extraMultiplier = extraMultiplier;
        this.env = env;
    }
    run(config) {
        try {
            this.init();
            for (let file of config.inputFiles) {
                try {
                    fs_extra_1.copySync(file.src, path_1.join(this.isolatePath, 'box', file.dst));
                }
                catch (e) {
                }
            }
            const options = {
                meta: this.metaPath,
                mem: config.memory,
                time: config.time,
                wallTime: config.time * this.wallMultiplier + this.wallDelta,
                extraTime: config.time * this.extraMultiplier + this.extraDelta,
                boxId: this.boxID,
                stack: config.memory,
                stderrToStdout: true,
                processes: config.processes,
                shareNet: config.shareNet,
                cg: true,
                cgMem: config.memory,
                cgTiming: true,
            };
            const args = [];
            for (const key in options) {
                if (typeof options[key] === "boolean") {
                    if (options[key]) {
                        args.push(utils_1.convertJsNameToIsolate(key));
                    }
                }
                else {
                    args.push(utils_1.convertJsNameToIsolate(key) + "=" + options[key]);
                }
            }
            for (const env of this.env) {
                args.push('--env=' + env);
            }
            args.push("--dir=/etc=/etc");
            args.push("--run");
            args.push(config.executable);
            if (config.arguments) {
                args.push("--");
                for (const arg of config.arguments) {
                    args.push(arg);
                }
            }
            let stdin = 'ignore';
            let stdout = 'ignore';
            if (config.stdin) {
                stdin = fs_extra_1.openSync(config.stdin, "r");
            }
            if (config.stdout) {
                stdout = fs_extra_1.openSync(config.stdout, "w");
            }
            const spawnConfig = {
                stdio: [stdin, stdout, 'ignore'],
            };
            if (process.platform === "win32") {
                spawnConfig.shell = "C:\\Windows\\System32\\bash.exe";
            }
            const result = child_process_1.spawnSync(this.isolateExecutable, args, spawnConfig);
            if (typeof stdin === "number")
                fs_extra_1.closeSync(stdin);
            if (typeof stdin === "number")
                fs_extra_1.closeSync(stdout);
            if (result.error) {
                throw result.error;
            }
            if (result.status >= 2) {
                throw new Error("Isolate exited with code " + result.status);
            }
            for (let file of config.outputFiles) {
                try {
                    fs_extra_1.copySync(path_1.join(this.isolatePath, 'box', file.src), file.dst);
                }
                catch (e) {
                }
            }
            const parsed = utils_1.parseMetaFile(this.metaPath);
            this.cleanup();
            let status = interface_1.RunStatus.RuntimeError;
            if (parsed.exitcode === '0') {
                status = interface_1.RunStatus.Succeeded;
            }
            else if (parsed.cgOomKilled) {
                status = interface_1.RunStatus.MemortLimitExceeded;
            }
            else if (parsed.killed) {
                status = interface_1.RunStatus.TimeLimitExceeded;
            }
            return {
                status,
                time: parseFloat(parsed.time),
                memory: parseInt(parsed.cgMem),
                message: parsed.message
            };
        }
        catch (e) {
            this.cleanup();
            return {
                status: interface_1.RunStatus.Failed,
                time: 0,
                memory: 0,
                message: e.message
            };
        }
    }
    cleanup() {
        const args = [`--box-id=${this.boxID}`, "--cg", "--cleanup"];
        const config = {
            stdio: [null, null, null],
        };
        if (process.platform === "win32") {
            config.shell = "C:\\Windows\\System32\\bash.exe";
        }
        child_process_1.spawnSync(this.isolateExecutable, args, config);
        try {
            if (this.metaPath)
                fs_extra_1.unlinkSync(this.metaPath);
            if (this.tmpDir)
                fs_extra_1.removeSync(this.tmpDir);
        }
        catch (e) {
        }
    }
    init() {
        const args = [`--box-id=${this.boxID}`, "--cg", "--init"];
        const config = {
            stdio: [null, null, null],
        };
        if (process.platform === "win32") {
            config.shell = "C:\\Windows\\System32\\bash.exe";
        }
        const result = child_process_1.spawnSync(this.isolateExecutable, args, config);
        if (result.error) {
            throw result.error;
        }
        if (result.status >= 2) {
            throw new Error("Isolate exited with code " + result.status);
        }
        fs_extra_1.ensureDirSync(this.tmpDir = path_1.join(__dirname, "..", "tmp", "" + this.boxID));
        this.isolatePath = result.stdout.toString().trim();
        this.metaPath = path_1.join(this.tmpDir, "meta");
    }
}
exports.PerillaSandbox = PerillaSandbox;
//# sourceMappingURL=index.js.map