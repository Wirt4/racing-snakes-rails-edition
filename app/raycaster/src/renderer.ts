interface Renderer {
	width: number;
	height: number;
	createCanvas(width: number, height: number): HTMLCanvasElement;
	parent(canvas: HTMLCanvasElement, elementId: string): void;
	background(color: string | number): void;
	fill(color: number, g?: number, b?: number): void;
	stroke(color: Color): void;
	noStroke(): void;
	strokeWeight(w: number): void;
	line(x1: number, y1: number, x2: number, y2: number): void;
	ellipse(x: number, y: number, r: number): void;
	rect(x: number, y: number, w: number, h: number): void;
	push(): void;
	pop(): void;
	scale(n: number): void;
}

