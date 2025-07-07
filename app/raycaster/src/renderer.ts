import { ColorName } from "./color/color_name";
import { hslFactory } from "./renderer/hsl_factory";
import { HSL } from "./renderer/hsl";
interface RendererInterface {
	fillColor(color: ColorName, brightness: number): void;
	rect(x: number, y: number, width: number, height: number): void;
	save(): void;
	scale(scale: number): void;
	stroke(color: ColorName): void;
	restore(): void;
	strokeWeight(weight: number): void;
	line(x1: number, y1: number, x2: number, y2: number): void;
	ellipse(x: number, y: number, stroke: number): void;
	noStroke(): void;
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

	public scale(scale: number): void {
		/** 
		 * Precondition: * - The context is a valid CanvasRenderingContext2D.
		 * Postcondition: * - The context is scaled by the specified factor.
		 * **/
		this.context.scale(scale, scale);
	}

	public save(): void {
		/**
		 * Precondition: the context behaves as previously set
		 * postcondition: the current state of the context is saved
		 **/
		this.context.save();
	}

	public restore(): void {
		/**
		 * Precondition: the context behaves as previously expected, including any overwrites since context.save()
		 * postcondition: the context is restored to the last saved state, disregarding any changes made since the last save
		 **/
		this.context.restore();
	}

	public reset(): void {
		this.context.reset();
	}

	public draw(): void {
		this.context.fillStyle = "#AAFF00"; // a nice green
		this.context.fillRect(130, 190, 40, 60);
	}

	public strokeWeight(weight: number): void {
		this.context.lineWidth = weight;
	}

	public line(x1: number, y1: number, x2: number, y2: number): void {
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context draws a line from (x1, y1) to (x2, y2)
		 */
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.stroke();
	}

	public rect(x: number, y: number, width: number, height: number): void {
		this.context.fillRect(x, y, width, height);
	}

	public fillColor(color: ColorName, brightness: number = 100): void {
		if (brightness < 0 || brightness > 100) {
			throw new Error("Brightness must be between 0 and 100");
		}

		const brightnessPercent = brightness / 100;
		let hsl: HSL;

		if (color == ColorName.RED) {
			hsl = hslFactory(ColorName.RED);
		} else {
			hsl = hslFactory(ColorName.PURPLE);
		}
		hsl.lightness *= brightnessPercent;
		this.context.fillStyle = hsl.toHex();
	}

	public ellipse(x: number, y: number, stroke: number): void {
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context draws an ellipse at the specified coordinates with the specified stroke weight, the ellipse defaults 
		 * to a circle of radius 1
		 */
		this.context.lineWidth = stroke;
		this.context.ellipse(x, y, 1, 1, 0, 0, 0)
	}

	public noStroke(): void {
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context is set to not stroke shapes
		 */
		this.context.strokeStyle = "transparent";
	}

	public stroke(color: ColorName): void {
		/**
		 * Precondition: the color is a valid Color object
		 * Postcondition: the context is set to stroke with the specified color
		 */
		//TODO: get a unified color system that folds in HSL and uses a consistent format determined by the color class or enum
		this.context.strokeStyle = hslFactory(color).toHex();
	}

	private assertIsPositiveInteger(value: number): void {
		if (!Number.isInteger(value) || value <= 0) {
			throw new Error("Value must be a positive integer");
		}
	}

}

export { Renderer, RendererInterface };
