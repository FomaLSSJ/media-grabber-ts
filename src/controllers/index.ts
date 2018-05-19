import { MainController } from "./api/main"
import { DownloaderController } from "./api/downloader"

export class Controllers {
    public main: MainController
    public downloader: DownloaderController

    constructor() {
        this.main = new MainController()
        this.downloader = new DownloaderController()
    }
}