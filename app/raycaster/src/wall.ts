import { Point } from './point';
import { Renderer } from './renderer';
import { Color } from './color';
class Wall {
	start: Point;
	end: Point;
	color: Color;
	constructor(x1: number, y1: number, x2: number, y2: number, color: Color) {
		//todo: add typechecks for numbers
		this.start = new Point(x1, y1);
		this.end = new Point(x2, y2);
		this.color = color;
	}

	draw2D(renderer: Renderer): void {
		renderer.stroke(this.color);
		renderer.strokeWeight(0.1);
		renderer.line(this.start.x, this.start.y, this.end.x, this.end.y);
	}
}
export { Wall };
