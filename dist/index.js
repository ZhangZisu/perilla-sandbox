"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const utils_1 = require("./utils");
class PerillaSandbox {
    constructor(isolatePath = "/usr/local/bin/isolate", boxID = 0, wallDelta = 0, wallMultiplier = 1, extraDelta = 0, extraMultiplier = 1) {
        this.isolatePath = isolatePath;
        this.boxID = boxID;
        this.wallDelta = wallDelta;
        this.wallMultiplier = wallMultiplier;
        this.extraDelta = extraDelta;
        this.extraMultiplier = extraMultiplier;
        const args = [`--box-id=${this.boxID}`, "--cg", "--init"];
        const config = {
            stdio: [null, null, null],
        };
        if (process.platform === "win32") {
            config.shell = "C:\\Windows\\System32\\bash.exe";
        }
        const result = child_process_1.spawnSync(this.isolatePath, args, config);
        if (result.error) {
            throw result.error;
        }
        if (result.status !== 0) {
            throw new Error("Isolate exited with code " + result.status);
        }
        fs_extra_1.ensureDirSync(this.tmpDir = path_1.join(__dirname, "..", "tmp", "" + this.boxID));
    }
    cleanup() {
        const args = [`--box-id=${this.boxID}`, "--cg", "--cleanup"];
        const config = {
            stdio: [null, null, null],
        };
        if (process.platform === "win32") {
            config.shell = "C:\\Windows\\System32\\bash.exe";
        }
        const result = child_process_1.spawnSync(this.isolatePath, args, config);
        if (result.error) {
            throw result.error;
        }
        if (result.status !== 0) {
            throw new Error("Isolate exited with code " + result.status);
        }
        fs_extra_1.emptyDirSync(this.tmpDir);
        fs_extra_1.removeSync(this.tmpDir);
    }
    run(config) {
        const metaPath = path_1.join(this.tmpDir, "meta");
        const options = {
            meta: metaPath,
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
        const args = utils_1.generateArguments(options, [`/data=${config.working}:rw`], [], config.executable, config.arguments);
        let stdin = null;
        let stdout = null;
        if (config.stdin) {
            stdin = fs_extra_1.openSync(stdin, "r");
        }
        if (config.stdout) {
            stdout = fs_extra_1.openSync(stdout, "w");
        }
        const spawnConfig = {
            stdio: [stdin, stdout, null],
        };
        if (process.platform === "win32") {
            spawnConfig.shell = "C:\\Windows\\System32\\bash.exe";
        }
        const result = child_process_1.spawnSync(this.isolatePath, args, spawnConfig);
    }
}
exports.PerillaSandbox = PerillaSandbox;
//# sourceMappingURL=index.js.map