import { spawnSync, SpawnSyncOptions } from "child_process";
import { closeSync, copySync, ensureDirSync, openSync, removeSync, unlinkSync } from "fs-extra";
import { join } from "path";
import { dirSync, SynchrounousResult } from "tmp";
import { IRunConfig, IRunResult, IsolateRawRunOptions, RunStatus } from "./interface";
import { convertJsNameToIsolate, parseMetaFile } from "./utils";

export class PerillaSandbox {
    private isolateExecutable: string;
    private boxID: number;
    private wallDelta: number;
    private wallMultiplier: number;
    private extraDelta: number;
    private extraMultiplier: number;
    private tmp: SynchrounousResult;
    private isolatePath: string;
    private metaPath: string;
    private env: string[];
    private dir: string[];
    public constructor(
        isolateExecutable: string = "/usr/local/bin/isolate",
        boxID: number = 0,
        wallDelta: number = 0,
        wallMultiplier: number = 1,
        extraDelta: number = 0,
        extraMultiplier: number = 1,
        env: string[] = ["PATH=/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin"],
        dir: string[] = ["/etc=/etc"]
    ) {
        this.isolateExecutable = isolateExecutable;
        this.boxID = boxID;
        this.wallDelta = wallDelta;
        this.wallMultiplier = wallMultiplier;
        this.extraDelta = extraDelta;
        this.extraMultiplier = extraMultiplier;
        this.env = env;
        this.dir = dir;
    }
    public run(config: IRunConfig): IRunResult {
        try {
            this.init();
            for (const file of config.inputFiles) {
                try {
                    copySync(file.src, join(this.isolatePath, "box", file.dst));
                } catch (e) {
                    // Eat any error
                }
            }
            const options: IsolateRawRunOptions = {
                meta: this.metaPath,
                time: config.time,
                wallTime: config.time * this.wallMultiplier + this.wallDelta,
                extraTime: config.time * this.extraMultiplier + this.extraDelta,
                boxId: this.boxID,
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
                    if (options[key]) { args.push(convertJsNameToIsolate(key)); }
                } else {
                    args.push(convertJsNameToIsolate(key) + "=" + options[key]);
                }
            }
            for (const env of this.env) {
                args.push("--env=\"" + env + "\"");
            }
            for (const dir of this.dir) {
                args.push("--dir=\"" + dir + "\"");
            }
            args.push("--run");
            args.push(config.executable);
            if (config.arguments) {
                args.push("--");
                for (const arg of config.arguments) {
                    args.push(arg);
                }
            }
            let stdin: any = "ignore";
            let stdout: any = "ignore";
            if (config.stdin) {
                stdin = openSync(config.stdin, "r");
            }
            if (config.stdout) {
                stdout = openSync(config.stdout, "w");
            }
            const spawnConfig: SpawnSyncOptions = {
                stdio: [stdin, stdout, "ignore"],
            };
            if (process.platform === "win32") {
                spawnConfig.shell = "C:\\Windows\\System32\\bash.exe";
            }
            const result = spawnSync(this.isolateExecutable, args, spawnConfig);
            if (typeof stdin === "number") { closeSync(stdin); }
            if (typeof stdin === "number") { closeSync(stdout); }
            if (result.error) {
                throw result.error;
            }
            if (result.status >= 2) {
                throw new Error("Isolate exited with code " + result.status);
            }
            for (const file of config.outputFiles) {
                try {
                    copySync(join(this.isolatePath, "box", file.src), file.dst);
                } catch (e) {
                    // Eat any error
                }
            }
            const parsed = parseMetaFile(this.metaPath);
            this.cleanup();
            let status = RunStatus.RuntimeError;
            if (parsed.exitcode === "0") {
                status = RunStatus.Succeeded;
            } else if (parsed.cgOomKilled) {
                status = RunStatus.MemoryLimitExceeded;
            } else if (parsed.killed) {
                status = RunStatus.TimeLimitExceeded;
            }
            return {
                status,
                time: parseFloat(parsed.time),
                memory: parseInt(parsed.cgMem, 10),
                message: parsed.message,
            };
        } catch (e) {
            this.cleanup();
            return {
                status: RunStatus.Failed,
                time: 0,
                memory: 0,
                message: e.message,
            };
        }
    }
    private cleanup() {
        const args = [`--box-id=${this.boxID}`, "--cg", "--cleanup"];
        const config: SpawnSyncOptions = {
            stdio: [null, null, null],
        };
        if (process.platform === "win32") {
            config.shell = "C:\\Windows\\System32\\bash.exe";
        }
        spawnSync(this.isolateExecutable, args, config);
        try {
            if (this.metaPath) { unlinkSync(this.metaPath); }
            if (this.tmp) { this.tmp.removeCallback(); }
        } catch (e) {
            // Eat any error
        }
    }
    private init() {
        const args = [`--box-id=${this.boxID}`, "--cg", "--init"];
        const config: SpawnSyncOptions = {
            stdio: [null, null, null],
        };
        if (process.platform === "win32") {
            config.shell = "C:\\Windows\\System32\\bash.exe";
        }
        const result = spawnSync(this.isolateExecutable, args, config);
        if (result.error) {
            throw result.error;
        }
        if (result.status >= 2) {
            throw new Error("Isolate exited with code " + result.status);
        }
        this.tmp = dirSync();
        this.isolatePath = result.stdout.toString().trim();
        this.metaPath = join(this.tmp.name, "meta");
    }
}
