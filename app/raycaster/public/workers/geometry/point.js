import { BMath } from "../boundedMath/bmath";
class Point {
    constructor(x, y) {
        this.bmath = BMath.getInstance();
        this.x = x;
        this.y = y;
    }
    nextLocation(angle, distance) {
        if (distance < 0) {
            throw new Error("Distance must be non-negative");
        }
        return new Point(this.x + this.bmath.cos(angle) * distance, this.y + this.bmath.sin(angle) * distance);
    }
}
export { Point };
