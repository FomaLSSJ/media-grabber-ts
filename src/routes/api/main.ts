import { Router } from "express"
import { Controllers } from "../../controllers"

export class MainRouter {
    private router: Router
    private controllers: Controllers

    constructor(controllers: Controllers) {
        this.router = Router()
        this.controllers = controllers
        this.init()
    }

    private init(): void {
        this.router.get("/", this.controllers.main.get)
    }

    public get instance(): Router {
        return this.router
    }
}