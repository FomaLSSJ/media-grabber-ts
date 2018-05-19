import { suite, test } from "mocha-typescript"
import { Application, Request, Response } from "express"
import * as chai from "chai"
import chaiHttp = require("chai-http")
import { App } from "../app"

/** Test suite Application Router */
@suite
class RouterTest {
    private app: Application

    constructor() {
        chai.use(chaiHttp)

        this.app = new App().instance
    }

    /** Test case Router Index */
    @test("Index")
    public create(): void {
        chai
            .request(this.app)
            .get("/")
            .end((err: Error, { status, body }) => {
                console.log(body)
                chai.assert.equal(err, undefined)
                chai.assert.equal(status, 200)
            })
    }
}