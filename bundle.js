(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Player            = require("./player");
const projectileManager = require("./projectile-manager");
const controller        = require("./input/controller");
const keyboardInput     = require("./input/keyboard-input");

/* Game Hub
 *
 * Everything goes through here, at least in previous projects. By the end of
 * the first game, the 'app.js' file was a mess. Need to make better decisions
 * about where things belong and how to organize systems.
 */

const game = {
    canvas: document.getElementById("viewport"),
    audioCtx: new (window.AudioContext || window.webkitAudioContext)()
};

game.init = function() {
    const CW = this.canvas.width,
          CH = this.canvas.height;

    this.player = new Player(CW / 2, CH / 2, projectileManager.projectiles);

    this.controller = controller(this.player);
    keyboardInput(this.controller);
};

game.draw = function() {
    const ctx = this.canvas.getContext("2d");

    this.player.draw(ctx);
    projectileManager.draw(ctx);
};

game.update = function() {

    this.controller.fire();

    projectileManager.update();
    projectileManager.clean();
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = game;
}

},{"./input/controller":3,"./input/keyboard-input":4,"./player":7,"./projectile-manager":8}],2:[function(require,module,exports){
charCodes = {
    // Mods
    16: "shft",
    17: "ctrl",
    18: "alt",

    // Misc
    32: "space",

    // Digits
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",

    // Alpha
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z"
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = charCodes;
}

},{}],3:[function(require,module,exports){
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

},{"./charcodes":2,"./linked-list":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
/* Linked List
 *
 * This implementation is not a fully-featured linked list, it only has the
 * parts that I need for queuing game actions
 */

function LinkedList(val, next) {
    "use strict";
    this.val = val;
    this.next = next || null;
}

LinkedList.prototype.addItem = function(val) {
    if (this.val) {
        this.next = new LinkedList(this.val, this.next);
    }
    this.val = val;
};

LinkedList.prototype.removeItem = function(val, prev) {
    if (this.val === val) {
        if (this.next) {
            this.val = this.next.val;
            this.next = this.next.next;
        } else {
            this.val = null;
            if (prev) {
                prev.next = null;
            }
        }
    } else {
        this.next.removeItem(val, this);
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = LinkedList;
}

},{}],6:[function(require,module,exports){
const game = require("./game");

(function() {
    "use strict";

    // Temp
    const canvas = document.getElementById("viewport"),
          cWidth = canvas.width,
          cHeight = canvas.height,
          ctx = canvas.getContext("2d");

    // Perm
    game.init();

    function main(tStamp) {
        window.requestAnimationFrame(main);

        // Temp
        ctx.clearRect(0, 0, cWidth, cHeight);

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, cWidth, cHeight);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeRect(8, 8, cWidth - 16, cHeight - 16);

        ctx.font = "48px monospace";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("SQUARES 2 | CIVIL WAR", cWidth / 2, cHeight / 3);

        // Perm
        game.draw();

        game.update();
    }
    main();
}());

},{"./game":1}],7:[function(require,module,exports){
const Projectile = require("./projectile");

function Player(x, y, projectiles) {
    "use strict";
    this.centerX    = x || 0;
    this.centerY    = y || 0;

    this.boxX       = -32;
    this.boxY       = -32;
    this.boxW       = 64;
    this.boxColor   = "black";
    this.emitX      = 8;
    this.emitY      = -8;
    this.emitW      = 16;
    this.emitColor  = "fuchsia";

    this.speed      = 4;
    this.angle      = -Math.PI / 2;
    this.turnSpeed  = 0.075;

    this.projectiles = projectiles;
}

Player.prototype.forward = function() {
    this.centerX += this.speed * Math.cos(this.angle);
    this.centerY += this.speed * Math.sin(this.angle);
};

Player.prototype.backward = function() {
    this.centerX -= this.speed / 2 * Math.cos(this.angle);
    this.centerY -= this.speed / 2 * Math.sin(this.angle);
}

Player.prototype.turnLeft = function() {
    this.angle -= this.turnSpeed;
};

Player.prototype.turnRight = function() {
    this.angle += this.turnSpeed;
};

Player.prototype.strafeLeft = function() {
    this.centerX += this.speed * 0.75 * Math.cos(this.angle - Math.PI / 2);
    this.centerY += this.speed * 0.75 * Math.sin(this.angle - Math.PI / 2);
};

Player.prototype.strafeRight = function() {
    this.centerX += this.speed * 0.75 * Math.cos(this.angle + Math.PI / 2);
    this.centerY += this.speed * 0.75 * Math.sin(this.angle + Math.PI / 2);
};

Player.prototype.shoot = function() {
    // Use the emitter center
    const x = this.centerX + this.emitW * Math.cos(this.angle),
          y = this.centerY;

    this.projectiles.push(new Projectile(x, y, this.emitW, this.angle,
                                         this.boxColor, this.emitColor));
};

Object.defineProperty(Player.prototype, "controls", {
    value: {
        "W": { action: "forward",       behaviour: "queued" },
        "S": { action: "backward",      behaviour: "queued" },
        "Q": { action: "strafeLeft",    behaviour: "queued" },
        "E": { action: "strafeRight",   behaviour: "queued" },

        "A": { action: "turnLeft",      behaviour: "free" },
        "D": { action: "turnRight",     behaviour: "free" },

        "space": { action: "shoot",     behaviour: "once" }
    }
});

Player.prototype.draw = function(ctx) {
    ctx.save();

    ctx.translate(this.centerX, this.centerY);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.boxColor;
    ctx.fillRect(this.boxX, this.boxY, this.boxW, this.boxW);
    ctx.fillStyle = this.emitColor;
    ctx.fillRect(this.emitX, this.emitY, this.emitW, this.emitW);

    ctx.restore();
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Player;
}

},{"./projectile":9}],8:[function(require,module,exports){
"use strict";

const projectileManager = {
    projectiles: [],

    update () {
        this.projectiles.forEach(proj => proj.update());
    },

    draw (ctx) {
        this.projectiles.forEach(proj => {

            if (proj.active) {
                proj.draw(ctx);
            }
        });
    },

    clean () {
        this.projectiles.forEach((proj, i, arr) => {
            if (!proj.active) {
                arr.splice(i, 1);
            }
        });
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = projectileManager;
}

},{}],9:[function(require,module,exports){
function Projectile(x, y, w, a, color1, color2) {
    "use strict";
    this.active         = true;
    this.centerX        = x;
    this.centerY        = y;
    this.angle          = a;
    this.speed          = 16;
    this.distance       = 0;
    this.maxDistance    = 400;
    
    this.outerW         = w;
    this.relOuterX      = -w / 2;
    this.relOuterY      = -w / 2;
    this.outerColor     = color1;

    this.innerW         = w / 2;
    this.relInnerX      = -w / 4;
    this.relInnerY      = -w / 4;
    this.innerColor     = color2;
}

Projectile.prototype.update = function() {
    const distX = this.speed * Math.cos(this.angle),
          distY = this.speed * Math.sin(this.angle);

    this.distance += Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

    if (this.distance > this.maxDistance) {
        this.active = false;
        return;
    } else {
        this.centerX += distX;
        this.centerY += distY;
    }
};

Projectile.prototype.draw = function(ctx) {
    ctx.save();

    ctx.translate(this.centerX, this.centerY);
    ctx.rotate(this.angle);

    ctx.fillStyle = this.outerColor;
    ctx.fillRect(this.relOuterX, this.relOuterY, this.outerW, this.outerW);
    ctx.fillStyle = this.innerColor;
    ctx.fillRect(this.relInnerX, this.relInnerY, this.innerW, this.innerW);

    ctx.restore();
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Projectile;
}

},{}]},{},[6]);
