
const { IOHook } = require("./index");

let hook = new IOHook();

hook.start();

hook.on("mousedown", function(e) {
    console.log("mosuedown => ", e);
});

hook.on("keydown", function(e) {
    console.log("keydown => ", e);
});

hook.on("keypress", function(e) {
    console.log("keypress => ", e);
});

hook.on("foreground_changed", function(e) {
    console.log("foreground window changed location => ", e);

    setTimeout(() => {
        hook.stop();
        hook.start();
    }, 500);
});

