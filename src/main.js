(function() {
    "use strict";

    // Temp
    const canvas = document.getElementById("viewport"),
          cWidth = canvas.width,
          cHeight = canvas.height,
          ctx = canvas.getContext("2d");

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
    }
    main();
}());
