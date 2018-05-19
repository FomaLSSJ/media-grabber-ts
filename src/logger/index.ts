const env: String = process.env.NODE_ENV

export class Logger {
    static log(...args): void {
        if (env !== "test") {
            console.log(args.join(" "))
        }
    }

    static info(...args): void {
        console.info(args.join(" "))
    }

    static warn(...args): void {
        if (env !== "production") {
            console.warn(args.join(" "))
        }
    }

    static error(...args): void {
        console.error(args.join(" "))
    }
}