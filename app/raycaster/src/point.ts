import { cos, sin } from "mathjs";
class Point {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	nextLocation(angle: number, distance: number): Point {
		if (distance < 0) {
			throw new Error("Distance must be non-negative");
		}
		return new Point(
			this.x + cos(angle) * distance,
			this.y + sin(angle) * distance
		);
	}
}

