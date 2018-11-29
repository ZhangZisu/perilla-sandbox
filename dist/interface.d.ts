export interface IsolateRawRunOptions {
    meta?: string;
    mem?: number;
    time?: number;
    wallTime?: number;
    extraTime?: number;
    boxId?: number;
    stack?: number;
    fsize?: number;
    quota?: string;
    stdin?: string;
    stdout?: string;
    stderr?: string;
    stderrToStdout?: boolean;
    chdir?: string;
    processes?: number;
    shareNet?: boolean;
    inheritFds?: boolean;
    verbose?: boolean;
    slient?: boolean;
    cg?: boolean;
    cgMem?: number;
    cgTiming?: boolean;
    noDefaultDirs?: boolean;
    [key: string]: string | number | boolean;
}
export interface IExchangeFile {
    src: string;
    dst: string;
}
export interface IRunConfig {
    memory: number;
    time: number;
    processes: number;
    shareNet: boolean;
    inputFiles: IExchangeFile[];
    outputFiles: IExchangeFile[];
    executable: string;
    arguments?: string[];
    stdin?: string;
    stdout?: string;
}
export declare enum RunStatus {
    Succeeded = 0,
    Failed = 1,
    TimeLimitExceeded = 2,
    MemoryLimitExceeded = 3,
    RuntimeError = 4
}
export interface IRunResult {
    memory: number;
    time: number;
    status: RunStatus;
    message?: string;
}
