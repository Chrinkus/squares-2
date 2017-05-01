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
