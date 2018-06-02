import * as path from "path"
import * as fs from "fs"
import * as _ from "lodash"
import fetch from "node-fetch"
import { load } from "cheerio"
import { Platform } from "../../interfaces";

export class EroprofilePlatform implements Platform {
    private format: string
    public name: string
    public domains: string[]

    constructor() {
        this.format = "m4v"
        this.name = "eroprofile"
        this.domains = [
            "www.eroprofile.com",
            "eroprofile.com",
            "eroprofile"
        ]
    }

    private async download(url: string, filepath: string): Promise<any> {
        const response = await fetch(url)
        const fileStream = fs.createWriteStream(filepath)
        response.body
            .on("error", console.error)
            .on("end", () => {
                fileStream.close()
                console.log(`[ EroProfile ] ${ filepath }`)
            })
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
        const elementsDesktop = html.match(/(file)(.*)(\/cdn)(.*)(\'\,)/g)
        const elementsMobile = html.match(/(")(https?:\/\/cdn)(.*)(")( )/g)
        if (elementsDesktop) {
            const videoUrlDesktop = elementsDesktop[ 0 ].split("\"")[ 1 ].replace(/&amp;/g, "&")
            await this.download(videoUrlDesktop, path.join(filesdir, dirname, `video-desktop.${ this.format }`))
        }
        if (elementsMobile) {
            const videoUrlMobile = elementsMobile[ 0 ].split("\"")[ 1 ].replace(/&amp;/g, "&")
            await this.download(videoUrlMobile, path.join(filesdir, dirname, `video-mobile.${ this.format }`))
        }
    }
}