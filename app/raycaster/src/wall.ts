class Wall {
	start: Point;
	end: Point;
	color: Color;;
	renderer: Renderer;

	constructor(x1: number, y1: number, x2: number, y2: number, color: Color, renderer: Renderer) {
		this.start = new Point(x1, y1);
		this.end = new Point(x2, y2);
		this.color = color;
		this.renderer = renderer;
	}

	draw2D() {
		this.renderer.stroke(this.color);
		this.renderer.strokeWeight(0.1);
		this.renderer.line(this.start.x, this.start.y, this.end.x, this.end.y);
	}

}
