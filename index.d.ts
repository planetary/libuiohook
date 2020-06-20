
declare module "libuiohook-node" {

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
    }
}
