import { Point } from '../geometry/point';
import { ContextRendererInterface } from '../renderer/interface';
import { ColorName } from './color/color_name';
class Wall {
	start: Point;
	end: Point;
	color: ColorName;
	constructor(x1: number, y1: number, x2: number, y2: number, color: ColorName) {
		//todo: add typechecks for numbers
		this.start = new Point(x1, y1);
		this.end = new Point(x2, y2);
		this.color = color;
	}

	draw2D(renderer: ContextRendererInterface): void {
		renderer.stroke(this.color);
		renderer.strokeWeight(0.1);
		renderer.line({ start: this.start, end: this.end });
	}
}
export { Wall };
