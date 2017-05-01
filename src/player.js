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
