
import { BMath } from "../boundedMath/bmath";
class Point {
	x: number;
	y: number;
	private bmath = BMath.getInstance();
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	nextLocation(angle: number, distance: number) {
		if (distance < 0) {
			throw new Error("Distance must be non-negative");
		}
		return new Point(
			this.x + this.bmath.cos(angle) * distance,
			this.y + this.bmath.sin(angle) * distance
		);
	}
}

export { Point };
