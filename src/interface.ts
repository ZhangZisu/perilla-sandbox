export interface IsolateRawRunConfig {
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

export interface IsolateRunConfig {
    memory: number;
    time: number;
    boxID: number;
    processes: number;
    shareNet: number;
}

export interface IPerillaSandboxConfig {
    isolatePath: string;
    boxID: number;
    wallDelta: number;
    wallMultiplier: number;
    extraDelta: number;
    extraMultiplier: number;
}
