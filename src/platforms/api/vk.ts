import * as path from "path"
import * as fs from "fs"
import * as _ from "lodash"
import * as VKApi from "node-vkapi"
import fetch from "node-fetch"
import { load } from "cheerio"
import { Platform } from "../../interfaces"
import * as Config from "config"

export class VkPlatform implements Platform {
    private vk: any
    private config: Config.IConfig
    public name: string
    public domains: string[]

    constructor() {
        this.vk = new VKApi()
        this.config = Config.get("vk")
        this.name = "vk.com"
        this.domains = [ "vk.com", "vk" ]
        this.init()
    }

    private async init(): Promise<any> {
        await this.vk.authorize({
            client:   this.config.get("client"),
            login:    this.config.get("login"),
            password: this.config.get("password")
        })
    }

    private findBestVideo(files: object[]): { file: string, format: string } {
        let format: string = 'mp4'
        let max: number = 0

        for (const file in files) {
            let [ newFormat, newMax ] = file.split('_')

            if (_.isEmpty(newMax)) continue

            if (Number(newMax) > max) {
                format = newFormat
                max = Number(newMax)
            }
        }

        return { file: files[`${ format }_${ max }`], format: format }
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
        const videoId = url.split('/').pop().split('o').pop()

        const videos = await this.vk.call("video.get", { videos: videoId })
        const [ item ] = videos.items
        const { id, files } = item
        const { file, format } = this.findBestVideo(files)

        if (!fs.existsSync(path.join(filesdir, videoId))) {
            fs.mkdirSync(path.join(filesdir, videoId))
        }

        await this.download(file, path.join(filesdir, videoId, `video.${ format }`))
    }
}