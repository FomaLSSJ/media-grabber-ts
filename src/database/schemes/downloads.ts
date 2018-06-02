import * as _ from "lodash"
import { Db } from "mongodb"

export class DownloadsScheme {
    private database: Db

    constructor(database: Db) {
        this.database = database
        this.init()
    }

    private async init():Promise<any> {
        const collections = await this.database.listCollections().toArray()
        if (_.find(collections, { name: "downloads" })) return
        await this.database.createCollection("downloads", {
            validator: {
                bsonType: "object",
                required: [ "platform", "description", "url", "file", "status" ],
                properties: {
                    platform: { bsonType: "string" },
                    description: { bsonType: "string" },
                    url: { bsonType: "string" },
                    file: { bsonType: "string" },
                    status: { bsonType: "boolean" }
                }
            },
            validationAction: 'warn',
            validationLevel: 'strict'
        })
        await this.database.collection('downloads').createIndex({ file: 1 }, { unique: true })
    }
}