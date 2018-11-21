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

export interface IExchangeFile{
    src:string;
    dst:string;
}

export interface IRunConfig {
    memory: number;
    time: number;
    processes: number;
    shareNet: boolean;
    mountEtc: boolean;
    inputFiles: IExchangeFile[];
    outputFiles: IExchangeFile[];
    executable: string;
    arguments?: string[];
    stdin?: string;
    stdout?: string;
}

export enum RunStatus {
    Succeeded,
    Failed,
    TimeLimitExceeded,
    MemortLimitExceeded,
    RuntimeError,
}

export interface IRunResult {
    memory: number;
    time: number;
    status: RunStatus;
    message?: string;
}
