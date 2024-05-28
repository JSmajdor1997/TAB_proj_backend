import LogLevel from "./LogLevel";
import chalk from 'chalk';

export default class Logger {
    private static readonly LogLevelsColorsMap = {
        [LogLevel.Success]: chalk.green,
        [LogLevel.Info]: chalk.blue,
        [LogLevel.Warning]: chalk.yellow,
        [LogLevel.Error]: chalk.red,
        [LogLevel.CriticalError]: chalk.bgRed.white
    }

    private readonly tags: string[] = []
    constructor(tags: string[], private readonly levels: LogLevel[] = [LogLevel.Success, LogLevel.Info, LogLevel.Warning, LogLevel.Error, LogLevel.CriticalError]) {
        this.tags.push(...tags)
    }

    log(level: LogLevel, message: string) {
        if (this.levels.includes(level)) {
            const allTags = this.tags.join(' | ')
            const log = `[${allTags.padEnd(60, " ")}]: ${message}`

            console.log(Logger.LogLevelsColorsMap[level](log))
        }
    }

    getSubLogger(tag: string) {
        return new Logger([...this.tags, tag], this.levels)
    }
}