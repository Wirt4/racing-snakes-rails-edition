import { Point } from './point';
import { RendererInterface } from './renderer';
import { ColorName } from './game/color/color_name';
import { Coordinates } from './geometry/coordinates';
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
