import { Request, Response, NextFunction } from "express"
import { Database } from "../../database"

export class MainController {
    constructor() {}

    public async get(req: Request, res: Response, next?: NextFunction): Promise<any> {
        const products = await Database.instance.collection("products").find({}, { fields: { _id: 0 } }).toArray()
        return res.json({ success: true, data: products })
    }
}