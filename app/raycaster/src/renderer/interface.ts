import { ColorName } from "../game/color/color_name";
import { Coordinates, LineSegment } from "../geometry/interfaces";

interface ContextRendererInterface {
	fillColor(color: ColorName, brightness: number): void;
	rect(origin: Coordinates, width: number, height: number): void;
	save(): void;
	scale(scale: number): void;
	stroke(color: ColorName): void;
	restore(): void;
	strokeWeight(weight: number): void;
	line(line: LineSegment): void;
	ellipse(origin: Coordinates, stroke: number): void;
	noStroke(): void;
	fillPath(path: Path2D): void;
}
export { ContextRendererInterface };
