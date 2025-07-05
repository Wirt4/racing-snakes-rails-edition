import { Point } from './point';

class Player {
	angle: number;
	position: Point;
	renderer: Renderer;
	//angle is in radians

	constructor(x: number, y: number, angle: number, renderer: Renderer) {
		this.position = new Point(x, y);
		this.angle = angle;
		this.renderer = renderer;
	}

	draw2D() {
		this.renderer.fill(Settings.MAX_BRIGHTNESS, 0, 0)
		this.renderer.noStroke();
		this.renderer.ellipse(this.position.x, this.position.y, 0.2);
	}
}


