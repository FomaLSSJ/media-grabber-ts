import * as path from "path"
import * as fs from "fs"
import * as _ from "lodash"
import fetch from "node-fetch"
import { load } from "cheerio"
import { Platform } from "../../interfaces";

export class WifepornPlatform implements Platform {
    public name: string
    public domains: string[]

    constructor() {
        this.name = "wifeporn"
        this.domains = [
            "www.wifeporn.de",
            "wifeporn.de",
            "wifeporn"
        ]
    }

    public validator(domain): boolean {
        return !!_.find(this.domains, x => _.includes(domain, x))
    }

    public async resolver(url: string, filesdir?: string): Promise<any> {
        const dirname: string = url.split("/").pop()

        if (!fs.existsSync(path.join(filesdir, dirname))) {
            fs.mkdirSync(path.join(filesdir, dirname))
        }

        const page = await fetch(url)
        const body = await page.text()
        const $ = load(body)

        $("div.album-list ul.thumbs li").find("a").each(async (i, elem): Promise<any> => {
            const href = ($(elem).attr("href"))
            const filename = href.split("/").pop()
            const response = await fetch(href)
            const fileStream = fs.createWriteStream(path.join(filesdir, dirname, filename))
            response.body
                .on("error", console.error)
                .on("end", fileStream.close)
                .pipe(fileStream)
        })
    }
}