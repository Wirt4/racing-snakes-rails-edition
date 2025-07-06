import { Point } from './point';
import { Renderer } from './renderer';
class Player {
	position: Point;
	angle: number; //angle in radians
	//angle is in radians
	constructor(x: number, y: number, angle: number) {
		this.position = new Point(x, y);
		this.angle = angle;
	}

	draw2D(renderer: Renderer) {
		renderer.fillColor('red');
		renderer.noStroke();
		renderer.ellipse(this.position.x, this.position.y, 0.2);
	}
}
export { Player };
