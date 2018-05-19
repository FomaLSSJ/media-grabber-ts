import * as _ from "lodash"
import * as fs from "fs"
import * as path from "path"
import { Platform } from "../../interfaces"
import { Request, Response, NextFunction } from "express"
import { Database } from "../../database"
import { Platforms } from "../../platforms"
import { URL } from "url"

export class DownloaderController {
    private filesdir: string
    private platforms: Platforms

    constructor() {
        this.filesdir = path.join(__dirname, "../../files")
        this.platforms = new Platforms()
        this.init()
    }

    private init(): void {
        if (!fs.existsSync(this.filesdir)) {
            fs.mkdirSync(this.filesdir)
        }
    }

    private async getter(url: string): Promise<any> {
        const urlParse = new URL(url)

        const platform: Platform = this.platforms.get(urlParse.host)
        console.log(urlParse.host, platform)
        if (!platform) return

        await platform.resolver(url, this.filesdir)
    }

    public async post (req: Request, res: Response, next?: NextFunction): Promise<any> {
        const { data } = req.body
        if (!data) return res.json({ success: false })
        await _.isArray(data) ? data.forEach(async (x) => await this.getter(x)) : this.getter(data)
        return res.json({ success: true })
    }
}