import { suite, test } from "mocha-typescript"
import { Application, Request, Response } from "express"
import * as chai from "chai"
import chaiHttp = require("chai-http")
import { App } from "../app"
import { Database } from "../database"
import { Emitter } from "../emitter"

/** Test suite Application */
@suite
class ApplicationTest {
    private app: Application

    constructor() {
        this.app = App.staticInstance
        this.init()
    }

    private init(): void {
        chai.use(chaiHttp)
    }

    static before(done) {
        process.env.NODE_ENV = "test"
        new App()
        Emitter.instance.on("dbinit", done)
    }

    /** Test case Start */
    @test("App started")
    public start(done): void {
        chai.assert.isNotNull(this.app)
        done()
    }

    @test("Database started")
    public database(done): void {
        chai.assert.isNotNull(Database.instance)
        done()
    }
}