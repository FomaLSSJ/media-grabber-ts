import { suite, test } from "mocha-typescript"
import { Application, Request, Response } from "express"
import * as chai from "chai"
import chaiHttp = require("chai-http")
import { App } from "../app"
import { Emitter } from "../emitter"

/** Test suite Application Downloader */
@suite
class DownloaderRouterTest {
    private app: Application

    constructor() {
        this.app = App.staticInstance
        this.init()
    }

    private init(): void {
        chai.use(chaiHttp)
    }

    /** Test case Post */
    @test("Post")
    public create(done): void {
        chai
            .request(this.app)
            .post("/downloader/")
            .end((err: Error, { status, body }) => {
                chai.assert.equal(err, undefined)
                chai.assert.equal(status, 200)
                chai.assert.hasAnyKeys(body, [ "success" ])
                chai.assert.equal(body.success, false)
                /*
                chai.assert.isArray(body.data)
                chai.assert.lengthOf(body.data, 5)
                */
                done()
            })
    }
}