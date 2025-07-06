import { Color } from "./color";
interface RendererInterface {
	fillColor(color: string, brightness: number): void;
	rect(x: number, y: number, width: number, height: number): void;
}

class Renderer implements RendererInterface {
	private context: CanvasRenderingContext2D
	constructor(targetId: string, width: number, height: number) {
		this.assertIsPositiveInteger(width);
		this.assertIsPositiveInteger(height);

		const app = document.getElementById(targetId);
		if (!app) {
			throw new Error(`Element with id ${targetId} not found`);
		}

		const canvas = document.createElement("canvas");
		canvas.id = 'game-window';
		canvas.width = width;
		canvas.height = height;
		app.appendChild(canvas);

		const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
		if (!context) {
			throw new Error("Failed to get canvas context");
		}

		this.context = context;
	}

	public reset(): void {
		this.context.reset();
	}

	public draw(): void {
		this.context.fillStyle = "#AAFF00"; // a nice green
		this.context.fillRect(130, 190, 40, 60);
	}

	public strokeWeight(weight: number): void {
		//another throwaway, shapes will not natively have strokes
	}

	public line(x1: number, y1: number, x2: number, y2: number): void {
		//possible future implementation
	}

	public rect(x: number, y: number, width: number, height: number): void {
		this.context.fillRect(x, y, width, height);
	}

	public fillColor(color: string): void {
		if (color == 'red') {
			this.context.fillStyle = '#FF0000'; // red
		} else {
			this.context.fillStyle = "#AAFF00"; //green
		}
	}

	public ellipse(x: number, y: number, stroke: number): void { }

	public noStroke(): void {
		//this is a stub and a throwaway, shapes will not natively have strokes
	}

	public stroke(color: Color): void {
		//stub
	}

	private assertIsPositiveInteger(value: number): void {
		if (!Number.isInteger(value) || value <= 0) {
			throw new Error("Value must be a positive integer");
		}
	}

}

export { Renderer, RendererInterface };
