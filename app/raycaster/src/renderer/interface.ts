import { ColorName } from "../game/color/color_name";
import { Coordinates } from "../geometry/interfaces";

interface RendererInterface {
	fillColor(color: ColorName, brightness: number): void;
	rect(origin: Coordinates, width: number, height: number): void;
	save(): void;
	scale(scale: number): void;
	stroke(color: ColorName): void;
	restore(): void;
	strokeWeight(weight: number): void;
	line(start: Coordinates, end: Coordinates): void;
	ellipse(origin: Coordinates, stroke: number): void;
	noStroke(): void;
}
export { RendererInterface };
