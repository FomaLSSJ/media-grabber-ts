import * as path from "path"
import * as fs from "fs"
import * as _ from "lodash"
import fetch from "node-fetch"
import { load } from "cheerio"
import { Platform } from "../../interfaces"

export class PornhubPlatform implements Platform {
    private format: string

    public name: string
    public domains: string[]

    constructor() {
        this.format = "mp4"
        this.name = "pornhub"
        this.domains = [
            "www.pornhub.com",
            "pornhub.com",
            "pornhub"
        ]
    }

    private async download(url: string, filepath: string): Promise<any> {
        const response = await fetch(url)
        const fileStream = fs.createWriteStream(filepath)
        response.body
            .on("error", console.error)
            .on("end", () => {
                fileStream.close()
                console.log(`[ PornHub ] ${ filepath }`)
            })
            .pipe(fileStream)
    }

    private findTitle(bodyStr: string): string {
        const $ = load(bodyStr)
        const title = $('title').text()
        const arr = title.split('-')
        arr.pop()

        return arr.join('-')
    }

    private parseDownloadInfo(bodyStr: string): object {
        let info
        const idx = bodyStr.indexOf('mediaDefinitions')

        if (idx < 0) return info

        let begin, end
        for (let i = idx; i < bodyStr.length; i++) {
            const tmpStr = bodyStr.substr(i, 1)
            if (tmpStr === '[') begin = i
            if (tmpStr === ']') {
                end = i
                break
            }
        }

        if (begin >=0 && end >= 0) {
            const jsonStr = bodyStr.substring(begin, end + 1)
            let arr = JSON.parse(jsonStr)
            arr = _.filter(arr, item => item.videoUrl.length > 0)
            arr = _.orderBy(arr, 'quality', 'desc')

            if (arr.length > 0) {
                info = arr[0]
                info.title = this.findTitle(bodyStr)
            }
        }

        return info
    }

    private async findDownloadInfo(key: string): Promise<any> {
        const url = key.startsWith('http') ? key : `https://www.pornhub.com/view_video.php?viewkey=${ key }`

        const response = await fetch(url)
        const body = await response.text()

        return this.parseDownloadInfo(body)
    }

    public validator(domain): boolean {
        return Boolean(_.find(this.domains, x => _.includes(domain, x)))
    }

    public async resolver(url: string, filesdir?: string): Promise<any> {
        const { title, videoUrl } = await this.findDownloadInfo(url)
        
        if (!fs.existsSync(path.join(filesdir, title))) {
            fs.mkdirSync(path.join(filesdir, title))
        }

        await this.download(videoUrl, path.join(filesdir, title, `video.${ this.format }`))
    }
}