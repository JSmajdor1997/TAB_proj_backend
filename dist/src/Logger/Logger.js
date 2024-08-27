"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevel_1 = __importDefault(require("./LogLevel"));
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor(tags, levels = [LogLevel_1.default.Success, LogLevel_1.default.Info, LogLevel_1.default.Warning, LogLevel_1.default.Error, LogLevel_1.default.CriticalError]) {
        this.levels = levels;
        this.tags = [];
        this.tags.push(...tags);
    }
    log(level, message) {
        if (this.levels.includes(level)) {
            const allTags = this.tags.join(' | ');
            const log = `[${allTags.padEnd(60, " ")}]: ${message}`;
            console.log(Logger.LogLevelsColorsMap[level](log));
        }
    }
    getSubLogger(tag) {
        return new Logger([...this.tags, tag], this.levels);
    }
}
Logger.LogLevelsColorsMap = {
    [LogLevel_1.default.Success]: chalk_1.default.green,
    [LogLevel_1.default.Info]: chalk_1.default.blue,
    [LogLevel_1.default.Warning]: chalk_1.default.yellow,
    [LogLevel_1.default.Error]: chalk_1.default.red,
    [LogLevel_1.default.CriticalError]: chalk_1.default.bgRed.white
};
exports.default = Logger;
