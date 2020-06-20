
/// <reference path="../index.d.ts" />


import { EventEmitter } from "events";

const native = require("./iohook.node");

import { Events, KeyModifiersMasks } from "./enums";

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

        this._decorateEventWithModifiers(event);

        this.emit(event.type, event);

    }

    private _decorateEventWithModifiers(event: LibUIOHookNode.IHookEvent) {
        event.isShiftPressed = (event.mask & KeyModifiersMasks.Shift_L) === KeyModifiersMasks.Shift_L
            || (event.mask & KeyModifiersMasks.Shift_R) === KeyModifiersMasks.Shift_R;
        event.isCtrlPressed = (event.mask & KeyModifiersMasks.Ctrl_L) === KeyModifiersMasks.Ctrl_L
            || (event.mask & KeyModifiersMasks.Ctrl_R) === KeyModifiersMasks.Ctrl_R;
        event.isAltPressed = (event.mask & KeyModifiersMasks.Alt_L) === KeyModifiersMasks.Alt_L
            || (event.mask & KeyModifiersMasks.Alt_R) === KeyModifiersMasks.Alt_R;
        event.isMetaPressed = (event.mask & KeyModifiersMasks.Meta_L) === KeyModifiersMasks.Meta_L
            || (event.mask & KeyModifiersMasks.Meta_R) === KeyModifiersMasks.Meta_R;
    }

}
