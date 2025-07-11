import { Point } from '../geometry/point';
import { RendererInterface } from '../renderer/renderer';
import { ColorName } from './color/color_name';
import { Coordinates } from '../geometry/interfaces';
class Player {
	position: Point;
	angle: number;
	constructor(coordinates: Coordinates, radians: number = 0) {
		this.position = new Point(coordinates.x, coordinates.y);
		this.angle = radians;
	}

	draw2D(renderer: RendererInterface) {
		renderer.fillColor(ColorName.RED, 100);
		renderer.noStroke();
		renderer.ellipse(this.position, 0.2);
	}
}
export { Player };
