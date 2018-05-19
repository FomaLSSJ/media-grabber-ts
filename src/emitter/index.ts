import { EventEmitter } from "events"

let events: EventEmitter

export class Emitter {
    public static init() {
        events = new EventEmitter()
    }

    public static get instance(): EventEmitter {
        return events
    }
}