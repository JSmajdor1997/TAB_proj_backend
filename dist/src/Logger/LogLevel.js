"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Success"] = 1] = "Success";
    LogLevel[LogLevel["Error"] = 2] = "Error";
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    LogLevel[LogLevel["CriticalError"] = 4] = "CriticalError";
})(LogLevel || (LogLevel = {}));
exports.default = LogLevel;
