export class Logger {
    static log(...args): void {
        if (process.env.NODE_ENV !== "test") {
            console.log(args.join(" "))
        }
    }

    static info(...args): void {
        console.info(args.join(" "))
    }

    static warn(...args): void {
        if (process.env.NODE_ENV !== "production") {
            console.warn(args.join(" "))
        }
    }

    static error(...args): void {
        console.error(args.join(" "))
    }
}