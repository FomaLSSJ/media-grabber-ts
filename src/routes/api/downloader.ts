import { Router, Request, Response } from "express"
import { Controllers } from "../../controllers";

export class DownloaderRouter {
    private router: Router
    private controllers: Controllers

    constructor(controllers: Controllers) {
        this.router = Router()
        this.controllers = controllers
        this.init()
    }

    private init(): void {
        this.router.post("/", (req: Request, res: Response) => this.controllers.downloader.post(req, res))
    }

    public get instance(): Router {
        return this.router
    }
}