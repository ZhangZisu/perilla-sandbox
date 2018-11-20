import { fork, spawn, spawnSync, SpawnSyncOptions } from "child_process";
import { createReadStream, emptyDirSync, ensureDirSync, openSync, removeSync } from "fs-extra";
import { join } from "path";
import { IsolateRawRunOptions, IsolateRunConfig } from "./interface";
import { generateArguments } from "./utils";

export class PerillaSandbox {
    private isolatePath: string;
    private boxID: number;
    private wallDelta: number;
    private wallMultiplier: number;
    private extraDelta: number;
    private extraMultiplier: number;
    private tmpDir: string;
    public constructor(isolatePath: string = "/usr/local/bin/isolate", boxID: number = 0, wallDelta: number = 0, wallMultiplier: number = 1, extraDelta: number = 0, extraMultiplier: number = 1) {
        this.isolatePath = isolatePath;
        this.boxID = boxID;
        this.wallDelta = wallDelta;
        this.wallMultiplier = wallMultiplier;
        this.extraDelta = extraDelta;
        this.extraMultiplier = extraMultiplier;
        const args = [`--box-id=${this.boxID}`, "--cg", "--init"];
        const config: SpawnSyncOptions = {
            stdio: [null, null, null],
        };
        if (process.platform === "win32") {
            config.shell = "C:\\Windows\\System32\\bash.exe";
        }
        const result = spawnSync(this.isolatePath, args, config);
        if (result.error) {
            throw result.error;
        }
        if (result.status !== 0) {
            throw new Error("Isolate exited with code " + result.status);
        }
        ensureDirSync(this.tmpDir = join(__dirname, "..", "tmp", "" + this.boxID));
    }
    public cleanup() {
        const args = [`--box-id=${this.boxID}`, "--cg", "--cleanup"];
        const config: SpawnSyncOptions = {
            stdio: [null, null, null],
        };
        if (process.platform === "win32") {
            config.shell = "C:\\Windows\\System32\\bash.exe";
        }
        const result = spawnSync(this.isolatePath, args, config);
        if (result.error) {
            throw result.error;
        }
        if (result.status !== 0) {
            throw new Error("Isolate exited with code " + result.status);
        }
        emptyDirSync(this.tmpDir);
        removeSync(this.tmpDir);
    }
    public run(config: IsolateRunConfig) {
        const metaPath = join(this.tmpDir, "meta");
        const options: IsolateRawRunOptions = {
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
        const args = generateArguments(options, [`/data=${config.working}:rw`], [], config.executable, config.arguments);
        let stdin = null;
        let stdout = null;
        if (config.stdin) {
            stdin = openSync(stdin, "r");
        }
        if (config.stdout) {
            stdout = openSync(stdout, "w");
        }
        const spawnConfig: SpawnSyncOptions = {
            stdio: [stdin, stdout, null],
        };
        if (process.platform === "win32") {
            spawnConfig.shell = "C:\\Windows\\System32\\bash.exe";
        }
        const result = spawnSync(this.isolatePath, args, spawnConfig);
        //
    }
}
