import * as path from "path"
import * as fs from "fs"
import * as _ from "lodash"
import fetch from "node-fetch"
import { load } from "cheerio"
import { Platform } from "../../interfaces";

export class XvideosPlatform implements Platform {
    private format: string
    public name: string
    public domains: string[]

    constructor() {
        this.format = "mp4"
        this.name = "xvideos"
        this.domains = [
            "www.xvideos.com",
            "xvideos.com",
            "xvideos"
        ]
    }

    private async download(url: string, filepath: string): Promise<any> {
        const response = await fetch(url)
        const fileStream = fs.createWriteStream(filepath)
        response.body
            .on("error", console.error)
            .on("end", fileStream.close)
            .pipe(fileStream)
    }

    public validator(domain): boolean {
        return Boolean(_.find(this.domains, x => _.includes(domain, x)))
    }

    public async resolver(url: string, filesdir?: string): Promise<any> {
        const dirname: string = url.split("/").pop()

        if (!fs.existsSync(path.join(filesdir, dirname))) {
            fs.mkdirSync(path.join(filesdir, dirname))
        }

        const page = await fetch(url)
        const body = await page.text()
        const $ = load(body)

        const html = $.html()
        const elementsName = html.match(/(html5player.setVideoTitle)..(.*).../g) 
        const elementsUri = html.match(/(html5player.setVideoUrlHigh)..(.*).../g)
        if (elementsName && elementsUri) {
            const videoName = elementsName[ 0 ].split("'")[ 1 ]
            const videoUrl = elementsUri[ 0 ].split("'")[ 1 ]
            await this.download(videoUrl, path.join(filesdir, dirname, `${ videoName }.${ this.format }`))
        }
    }
}