"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    nextLocation(angle, distance) {
        if (distance < 0) {
            throw new Error("Distance must be non-negative");
        }
        return new Point(this.x + Math.cos(angle) * distance, this.y + Math.sin(angle) * distance);
    }
}
exports.Point = Point;
