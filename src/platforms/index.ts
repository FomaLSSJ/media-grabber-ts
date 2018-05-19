import { Platform } from "../interfaces"
import * as _ from "lodash"
import { WifepornPlatform } from "./api/wifeporn"
import { DevkiPlatform } from "./api/devki"
import { XvideosPlatform } from "./api/xvideos"
import { VkPlatform } from "./api/vk"


export class Platforms {
    private platforms: Platform[]

    constructor() {
        this.platforms = []
        this.init()
    }

    private init(): void {
        this.platforms.push(new WifepornPlatform())
        this.platforms.push(new DevkiPlatform())
        this.platforms.push(new XvideosPlatform())
        this.platforms.push(new VkPlatform())
    }

    public get(domain): Platform {
        return _.find(this.platforms, x => _.includes(domain, x.name))
    }
}