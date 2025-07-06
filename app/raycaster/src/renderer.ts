import { Color } from "./color";
interface RendererInterface {
	fillColor(color: string, brightness: number): void;
	rect(x: number, y: number, width: number, height: number): void;
	save(): void;
	scale(scale: number): void;
	stroke(color: Color): void;
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
		throw new Error("strokeWeight is not implemented in Renderer");
	}

	public line(x1: number, y1: number, x2: number, y2: number): void {
		throw new Error("line is not implemented in Renderer");
	}

	public rect(x: number, y: number, width: number, height: number): void {
		this.context.fillRect(x, y, width, height);
	}

	public fillColor(color: string, brightness: number = 100): void {
		const percent = brightness / 200;
		if (percent < 0 || percent > 1) {
			throw new Error("Brightness must be between 0 and 100");
		}

		if (color == 'red') {
			this.context.fillStyle = this.HSLToHex({ h: 1, s: 100, l: brightness })
		} else {
			this.context.fillStyle = this.HSLToHex({ h: 120, s: 100, l: brightness })
		}
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

	public stroke(color: Color): void {
		/**
		 * Precondition: the color is a valid Color object
		 * Postcondition: the context is set to stroke with the specified color
		 */
		//TODO: get a unified color system that folds in HSL and uses a consistent format determined by the color class or enum
		this.context.strokeStyle = color.toString();
	}

	private assertIsPositiveInteger(value: number): void {
		if (!Number.isInteger(value) || value <= 0) {
			throw new Error("Value must be a positive integer");
		}
	}

	private HSLToHex(hsl: { h: number; s: number; l: number }): string {
		const { h, s, l } = hsl;

		const lDecimal = l / 100;
		const a = (s * Math.min(lDecimal, 1 - lDecimal)) / 100;
		const f = (n: number) => {
			const k = (n + h / 30) % 12;
			const color = lDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

			return Math.round(255 * color)
				.toString(16)
				.padStart(2, "0");
		};

		return `#${f(0)}${f(8)}${f(4)}`;
	}


}

export { Renderer, RendererInterface };
