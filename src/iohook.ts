
/// <reference path="../index.d.ts" />


import { EventEmitter } from "events";

const native = require("./iohook.node");

export enum Events {
    keypress = "keypress",
    keydown = "keydown",
    keyup = "keyup",
    mouseclick = "mouseclick",
    mousedown = "mousedown",
    mouseup = "mouseup",
    mousemove = "mousemove",
    mousedrag = "mousedrag",
    mousewheel = "mousewheel",
}

let EVENTS: Map<number, LibUIOHookNode.Events> = null;

function initEvents() {
    if (!!EVENTS) return;

    EVENTS = new Map();

    EVENTS.set(3, Events.keypress);
    EVENTS.set(4, Events.keydown);
    EVENTS.set(5, Events.keyup);
    EVENTS.set(6, Events.mouseclick);
    EVENTS.set(7, Events.mousedown);
    EVENTS.set(8, Events.mouseup);
    EVENTS.set(9, Events.mousemove);
    EVENTS.set(10, Events.mousedrag);
    EVENTS.set(11, Events.mousewheel);
}


export class IOHook extends EventEmitter {

    private _isActive: boolean;
    private _isHookStarted: boolean;

    public constructor() {
        super();

        initEvents();

        this._isActive = false;
        this._startHook();
    }

    public start() {
        this._startHook();
        this._isActive = true;
    }

    public pause() {
        this._isActive = false;
    }

    public stop() {
        this.pause();
        this._stopHook();
    }

    private _startHook() {
        if (this._isHookStarted) return;
        this._isHookStarted = true;

        native.startHook(this._nativeEventHandler.bind(this));
    }

    private _stopHook() {
        if (!this._isHookStarted) return;
        this._isHookStarted = false;

        native.stopHook();
    }

    private _nativeEventHandler(nativeEvent: LibUIOHookNode.INativeEvent) {

        if (!nativeEvent || !this._isActive) return;

        if (!EVENTS.has(nativeEvent.type)) {
            console.warn("unrecognized event type: ", nativeEvent.type, nativeEvent);
            return;
        }

        let event: LibUIOHookNode.IHookEvent = {
            type: EVENTS.get(nativeEvent.type),
            mask: nativeEvent.mask,
        };

        event = Object.assign({}, event, nativeEvent.mouse || nativeEvent.keyboard || nativeEvent.wheel);

        this.emit(event.type, event);

    }

}
