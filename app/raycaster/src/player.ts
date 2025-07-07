import { Point } from './point';
import { RendererInterface } from './renderer';
import { ColorName } from './color/color_name';
class Player {
	position: Point;
	angle: number; //angle in radians
	//angle is in radians
	constructor(position: { x: number, y: number }, angle: number = 0) {
		this.position = new Point(position.x, position.y);
		this.angle = angle;
	}

	draw2D(renderer: RendererInterface) {
		renderer.fillColor(ColorName.RED, 100);
		renderer.noStroke();
		renderer.ellipse(this.position.x, this.position.y, 0.2);
	}
}
export { Player };
