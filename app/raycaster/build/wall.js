"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wall = void 0;
const point_1 = require("./point");
class Wall {
    constructor(x1, y1, x2, y2, color) {
        //todo: add typechecks for numbers
        this.start = new point_1.Point(x1, y1);
        this.end = new point_1.Point(x2, y2);
        this.color = color;
    }
    draw2D(renderer) {
        renderer.stroke(this.color);
        renderer.strokeWeight(0.1);
        renderer.line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}
exports.Wall = Wall;
