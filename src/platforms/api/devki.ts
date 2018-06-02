import * as path from "path"
import * as fs from "fs"
import * as _ from "lodash"
import fetch from "node-fetch"
import { load } from "cheerio"
import { Platform } from "../../interfaces"
import { Database } from "../../database"

export class DevkiPlatform implements Platform {
    private domain: string
    public name: string
    public domains: string[]

    constructor() {
        this.domain = "http://devki.net"
        this.name = "devki"
        this.domains = [
            "devki.net",
            "devki"
        ]
    }

    public validator(domain): boolean {
        return !!_.find(this.domains, x => _.includes(domain, x))
    }

    public async resolver(url: string, filesdir?: string): Promise<void> {
        const dirname: string = url.split("/").pop()

        if (!fs.existsSync(path.join(filesdir, dirname))) {
            fs.mkdirSync(path.join(filesdir, dirname))
        }

        const page = await fetch(url)
        const body = await page.text()
        const $ = load(body)

        $("div.post div.story.full div.img-in-full").find("img").each(async (i, elem) => {
            const src = ($(elem).attr("src"))
            const filename = src.split("/").pop()
            const response = await fetch(this.domain + src)
            const fileStream = fs.createWriteStream(path.join(filesdir, dirname, filename))
            response.body
                .on("error", console.error)
                .on("end", fileStream.close)
                .pipe(fileStream)
        })

        $("div.post div.dlevideoplayer ul").find("li").each(async (i, elem) => {
            const src = ($(elem).attr("data-url"))
            const filename = src.split("/").pop()
            const response = await fetch(src)
            const id = await Database.createDownloadDoc({
                platform: this.name,
                description: dirname,
                url: url,
                file: src,
                status: false
            })
            console.log(id)
            const fileStream = fs.createWriteStream(path.join(filesdir, dirname, filename))
            response.body
                .on("error", console.error)
                .on("end", async () => {
                    fileStream.close()
                    await Database.updateDownloadDoc(id, { status: true })
                    console.log(`[ Devki ] ${ dirname }/${ filename }`)
                })
                .pipe(fileStream)
        })
    }
}