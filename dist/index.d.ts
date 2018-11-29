import { IRunConfig, IRunResult, IOptionPair } from "./interface";
export declare class PerillaSandbox {
    private isolateExecutable;
    private boxID;
    private wallDelta;
    private wallMultiplier;
    private extraDelta;
    private extraMultiplier;
    private tmp;
    private isolatePath;
    private metaPath;
    private env;
    private dir;
    constructor(isolateExecutable?: string, boxID?: number, wallDelta?: number, wallMultiplier?: number, extraDelta?: number, extraMultiplier?: number, env?: IOptionPair, dir?: IOptionPair);
    run(config: IRunConfig): IRunResult;
    private cleanup;
    private init;
}
