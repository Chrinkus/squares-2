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
