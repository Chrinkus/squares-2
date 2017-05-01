const charCodes     = require("./charcodes");
const LinkedList    = require("./linked-list");

function controller(actor) {
    "use strict";
    const controls          = actor.controls,
          queue             = new LinkedList(),
          activeKeys        = Object.create(null),
          preventRepeat     = Object.create(null);

    function routeControl(charKey) {

        if (charKey in preventRepeat) {
            return;
        }

        switch (controls[charKey].behaviour) {
            case "queued":
                queue.addItem(charKey);
                preventRepeat[charKey] = true;
                break;

            case "once":
                actor[controls[charKey].action]();
                preventRepeat[charKey] = true;
                break;

            case "free":
                activeKeys[charKey] = true;
                break;

            default:
                console.error("Unregistered control key");
        }
    }

    function cancelKey(charKey) {

        switch (controls[charKey].behaviour) {
            case "queued":
                queue.removeItem(charKey);
                delete preventRepeat[charKey];
                break;

            case "once":
                delete preventRepeat[charKey];
                break;

            case "free":
                delete activeKeys[charKey];
                break;

            default:
                console.error("Sneaky key in keyUp");
        }
    }

    return {
        keyDown(code) {
            const charKey = charCodes[code];

            if (charKey in controls) {
                routeControl(charKey);
            }
        },

        keyUp(code) {
            const charKey = charCodes[code];

            if (charKey in controls) {
                cancelKey(charKey);
            }
        },

        fire() {
            let prop;

            // fire free controls
            for (prop in activeKeys) {
                actor[controls[prop].action]();
            }

            // fire queued controls
            if (queue.val) {
                actor[controls[queue.val].action]();
            }
        }
    };
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = controller;
}
