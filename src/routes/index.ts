import { Router as ExpressRouter } from "express"
import { Controllers } from "../controllers"
import { MainRouter } from "./api/main"
import { DownloaderRouter } from "./api/downloader"

export class Router {
    private router: ExpressRouter
    private controllers: Controllers
    private mainRouter: MainRouter
    private downloaderRouter: DownloaderRouter

    constructor(controllers: Controllers) {
        this.router = ExpressRouter()
        this.controllers = controllers
        this.mainRouter = new MainRouter(controllers)
        this.downloaderRouter = new DownloaderRouter(controllers)
        this.init()
    }

    private init(): void {
        this.router.use("/", this.mainRouter.instance)
        this.router.use("/downloader", this.downloaderRouter.instance)
    }

    public get instance(): ExpressRouter {
        return this.router
    }
}