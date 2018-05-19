import { MongoClient, Db } from "mongodb"
import * as Config from "config"
import { Emitter } from "../emitter"

let database: Db

export class Database {
    public static async init(): Promise<any> {
        const { host, port, dbname, user, pass } = Config.get("database")
        const URL = user && pass
            ? `mongodb://${ user }:${ pass }@${ host }:${ port }/${ dbname }`
            : `mongodb://${ host }:${ port }/${ dbname }`

        try {
            const connect = await MongoClient.connect(URL)
            database = connect.db(dbname)
            Emitter.instance.emit("dbinit")
            return database
        } catch (err) {
            console.error(err)
            return undefined
        }
    }

    public static async collection(name?: string): Promise<any> {
        return name ? database.collection(name) : database
    }

    public static get instance(): Db {
        return database
    }
}