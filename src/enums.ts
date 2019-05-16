
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

export enum KeyModifiersMasks {
    Shift_L = 0b1,
    Ctrl_L = 0b10,
    Meta_L = 0b100,
    Alt_L = 0b1000,

    Shift_R = 0b10000,
    Ctrl_R = 0b100000,
    Meta_R = 0b1000000,
    Alt_R = 0b10000000,
}
