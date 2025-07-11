import { ColorName } from "../game/color/color_name";
import { hslFactory } from "./hsl/hsl_factory";
import { HSL } from "./hsl/hsl";
import { Coordinates, LineSegment } from "../geometry/interfaces";
import { assertIsPositiveInteger } from "../utils";
import { RendererInterface } from "./interface";
class Renderer implements RendererInterface {
	private context: CanvasRenderingContext2D
	private hslCache: Record<ColorName, HSL> = {} as Record<ColorName, HSL>;

	constructor(targetId: string, width: number, height: number) {
		assertIsPositiveInteger(width);
		assertIsPositiveInteger(height);

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
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context is reset to its initial state, clearing any transformations or styles
		 */
		this.context.reset();
	}


	public strokeWeight(weight: number): void {
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context is set to stroke with the specified weight
		 */
		this.context.lineWidth = weight;
	}

	public line(line: LineSegment): void {
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context draws a line from (x1, y1) to (x2, y2)
		 */
		const { start, end } = line;
		this.context.beginPath();
		this.context.moveTo(start.x, start.y);
		this.context.lineTo(end.x, end.y);
		this.context.stroke();
	}

	public rect(origin: Coordinates, width: number, height: number): void {
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context draws a rectangle at the specified coordinates with the specified width and height
		 */
		this.context.fillRect(origin.x, origin.y, width, height);
	}

	public fillColor(color: ColorName, brightness: number = 100): void {
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context is set to fill with the specified color and brightness - the exact specs are keyed to the mapping of the color name
		 */
		if (brightness < 0 || brightness > 100) {
			throw new Error("Brightness must be between 0 and 100");
		}

		const brightnessPercent = brightness / 100;
		let hsl: HSL;
		if (color == ColorName.NONE) {
			hsl = this.getCachedHSL(ColorName.WHITE)
		} else {
			hsl = this.getCachedHSL(color)
		}

		hsl.lightness = brightnessPercent;
		this.context.fillStyle = hsl.toHex();
	}

	public ellipse(origin: Coordinates, stroke: number): void {
		/**
		 * Precondition: the context is a valid CanvasRenderingContext2D
		 * Postcondition: the context draws an ellipse at the specified coordinates with the specified stroke weight, the ellipse defaults 
		 * to a circle of radius 1
		 */
		this.context.lineWidth = stroke;
		this.context.ellipse(origin.x, origin.y, 1, 1, 0, 0, 0)
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
		this.context.strokeStyle = this.getCachedHSL(color).toHex();
	}

	private getCachedHSL(color: ColorName): HSL {
		if (!this.hslCache[color]) {
			this.hslCache[color] = hslFactory(color);
		}
		return this.hslCache[color];
	}

}

export { Renderer, RendererInterface };
