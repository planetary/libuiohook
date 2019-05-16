
declare module "libuiohook-node" {

    import { EventEmitter } from "events";

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

        foreground_changed = "foreground_changed",
        foreground_changed_location = "foreground_changed_location",
    }

    export class IOHook extends EventEmitter {
        constructor();

        start();
        stop();
        pause();
    }

}

declare namespace LibUIOHookNode {

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

        foreground_changed = "foreground_changed",
        foreground_changed_location = "foreground_changed_location",
        window_move_size_start = "window_move_size_start",
        window_move_size_end = "window_move_size_end",
    }

    export interface INativeEventMouse {
        button: number;
        clicks: number;
        x: number;
        y: number;
    }

    export interface INativeEventKeyboard {
        keychar: number;
        keycode: number;
        rawcode: number;
    }

    export interface INativeEventWheel {
        amount: number;
        clicks: number;
        wheeltype: number;
        direction: number;
        rotation: number;
        x: number;
        y: number;
    }

    export interface INativeEvent {
        type: number;
        mask: number;
        mouse?: INativeEventMouse;
        keyboard?: INativeEventKeyboard;
        wheel?: INativeEventWheel;
        bounds?: IRect;
        applicationName?: string;
    }

    export interface IHookEvent {
        type: Events;
        mask: number;

        button?: number;
        clicks?: number;
        x?: number;
        y?: number;

        keychar?: number;
        keycode?: number;
        rawcode?: number;

        amount?: number;
        direction?: number;
        rotation?: number;
        wheeltype?: number;

        isShiftPressed?: boolean;
        isCtrlPressed?: boolean;
        isMetaPressed?: boolean;
        isAltPressed?: boolean;

        bounds?: IRect;
        applicationName?: string;
    }

    interface IRect {
        x: number;
        y: number;
        width: number;
        height: number;
    }
}
