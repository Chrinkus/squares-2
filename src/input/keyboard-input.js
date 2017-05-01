function keyboardInput(controller) {
    "use strict";

    function downHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        controller.keyDown(event.keyCode, event.shiftKey);
    }

    function upHandler(event) {
        event.stopPropagation();

        controller.keyUp(event.keyCode, event.shiftKey);
    }

    document.addEventListener("keydown", downHandler, false);
    document.addEventListener("keyup", upHandler, false);
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = keyboardInput;
}
