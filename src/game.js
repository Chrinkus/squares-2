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
