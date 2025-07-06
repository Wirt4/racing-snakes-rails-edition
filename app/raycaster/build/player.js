"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const point_1 = require("./point");
const color_1 = require("./color");
class Player {
    //angle is in radians
    constructor(x, y, angle) {
        this.position = new point_1.Point(x, y);
        this.angle = angle;
    }
    draw2D(renderer) {
        renderer.fillColor(color_1.Color.RED, 100);
        renderer.noStroke();
        renderer.ellipse(this.position.x, this.position.y, 0.2);
    }
}
exports.Player = Player;
