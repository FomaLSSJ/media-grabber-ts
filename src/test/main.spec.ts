import { suite, test } from "mocha-typescript"
import { Application, Request, Response } from "express"
import * as chai from "chai"
import chaiHttp = require("chai-http")
import { App } from "../app"
import { Emitter } from "../emitter"

/** Test suite Main Router */
@suite
class MainRouterTest {
    private app: Application

    constructor() {
        this.app = App.staticInstance
        this.init()
    }

    private init(): void {
        chai.use(chaiHttp)
    }

    /** Test case Router Index Get */
    @test("Index")
    public create(done): void {
        chai
            .request(this.app)
            .get("/")
            .end((err: Error, { status, body }) => {
                chai.assert.equal(err, undefined)
                chai.assert.equal(status, 200)
                chai.assert.hasAnyKeys(body, [ "success", "data" ])
                chai.assert.equal(body.success, true)
                chai.assert.isArray(body.data)
                chai.assert.lengthOf(body.data, 5)
                done()
            })
    }
}