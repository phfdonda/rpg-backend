import chalk from 'chalk'

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    GAME = 'GAME',
    AGENT = 'AGENT',
}

export class Logger {
    private static getTimestamp(): string {
        return new Date().toISOString()
    }

    private static formatMessage(level: LogLevel, message: string): string {
        const timestamp = this.getTimestamp()
        let coloredLevel: string

        switch (level) {
            case LogLevel.INFO:
                coloredLevel = chalk.blue(`[${level}]`)
                break
            case LogLevel.WARN:
                coloredLevel = chalk.yellow(`[${level}]`)
                break
            case LogLevel.ERROR:
                coloredLevel = chalk.red(`[${level}]`)
                break
            case LogLevel.SUCCESS:
                coloredLevel = chalk.green(`[${level}]`)
                break
            case LogLevel.GAME:
                coloredLevel = chalk.magenta(`[${level}]`)
                break
            case LogLevel.AGENT:
                coloredLevel = chalk.cyan(`[${level}]`)
                break
            default:
                coloredLevel = `[${level}]`
        }

        return `${timestamp} ${coloredLevel} ${message}`
    }

    static info(message: string): void {
        console.log(this.formatMessage(LogLevel.INFO, message))
    }

    static warn(message: string): void {
        console.log(this.formatMessage(LogLevel.WARN, message))
    }

    static error(message: string): void {
        console.log(this.formatMessage(LogLevel.ERROR, message))
    }

    static success(message: string): void {
        console.log(this.formatMessage(LogLevel.SUCCESS, message))
    }

    static game(message: string): void {
        console.log(this.formatMessage(LogLevel.GAME, message))
    }

    static agent(message: string): void {
        console.log(this.formatMessage(LogLevel.AGENT, message))
    }
}

