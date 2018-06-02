import { MongoClient, Db, Collection, ObjectID, UpdateWriteOpResult } from "mongodb"
import * as Config from "config"
import { Emitter } from "../emitter"
import { DownloadsScheme } from "./schemes/downloads"
import { DownloadDoc } from "../interfaces"

let database: Db

export class Database {
    public static async init(): Promise<Db> {
        const { host, port, dbname, user, pass } = Config.get("database")
        const URL = user && pass
            ? `mongodb://${ user }:${ pass }@${ host }:${ port }/${ dbname }`
            : `mongodb://${ host }:${ port }/${ dbname }`

        try {
            const connect = await MongoClient.connect(URL)
            database = connect.db(dbname)
            await Database.schemes(database)
            Emitter.instance.emit("dbinit")
            return database
        } catch (err) {
            console.error(err)
            return undefined
        }
    }

    private static async schemes(database: Db): Promise<void> {
        await new DownloadsScheme(database)
    }

    public static async createDownloadDoc(doc: DownloadDoc): Promise<ObjectID> {
        const model = await Database.collection("downloads").insertOne(doc)
        return (model && model.result.ok) ? model.insertedId : undefined
    }

    public static async updateDownloadDoc(id: ObjectID, fields: object): Promise<void> {
        await Database.collection("downloads").updateOne({ _id: id }, { $set: fields })
    }

    public static collection(name?: string): Collection {
        return name ? database.collection(name) : undefined
    }

    public static get instance(): Db {
        return database
    }
}