"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RunStatus;
(function (RunStatus) {
    RunStatus[RunStatus["Succeeded"] = 0] = "Succeeded";
    RunStatus[RunStatus["Failed"] = 1] = "Failed";
    RunStatus[RunStatus["TimeLimitExceeded"] = 2] = "TimeLimitExceeded";
    RunStatus[RunStatus["MemortLimitExceeded"] = 3] = "MemortLimitExceeded";
    RunStatus[RunStatus["RuntimeError"] = 4] = "RuntimeError";
})(RunStatus = exports.RunStatus || (exports.RunStatus = {}));
//# sourceMappingURL=interface.js.map