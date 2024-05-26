import LogLevel from "./LogLevel";

export default class Logger {
    constructor(private readonly levels: LogLevel[]) { }

    log(level: LogLevel, tag: string, message: string) {
        if (this.levels.includes(level)) {
            console.log(`[${tag}]: ${message}`)
        }
    }
}