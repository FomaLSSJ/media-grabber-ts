import * as Express from "express"
import { json, urlencoded } from "body-parser"
import * as CookieParser from "cookie-parser"
import * as Config from "config"
import { Database } from "../database"
import { Logger } from "../logger"
import { Router } from "../routes"
import { Controllers } from "../controllers"
import { Emitter } from "../emitter"

/** Main application class */
export class App {
    /** Config container */
    private config: Config.IConfig
    /** Express application instance */
    private app: Express.Application
    /** Controllers instance */
    private controllers: Controllers
    /** Express Router instance */
    private router: Router
    /** EventEmitter instance */
    private events: Emitter

    /** App class constructor */
    constructor() {
        this.app = Express()
        this.init()
        this.start()
    }

    /** Initialize app instance */
    private async init(): Promise<any> {
        this.config = Config

        await Emitter.init()
        await Database.init()

        this.app.use(json())
        this.app.use(urlencoded({ extended: true }))
        this.app.use(CookieParser(this.config.get("secret")))

        this.controllers = await new Controllers()
        this.router = await new Router(this.controllers)

        this.app.use(this.router.instance)
    }

    public async start(): Promise<any> {
        this.app.listen(this.config.get("port"), () => {
            Logger.log(`App in [ ${ this.app.get("env") } ] env start on port ${ this.config.get("port") }`)
        })
    }

    /** Get application instance */
    public get instance(): Express.Application {
        return this.app
    }
}
