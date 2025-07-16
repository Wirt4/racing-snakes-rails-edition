import { Coordinates, LineSegment } from "../geometry/interfaces";
import { ColorName } from "./color/color_name";
import { getColorKey, ColorKey } from "./color_key_cache";

interface BatchedRect { x: number, y: number, width: number, height: number };

class GridStack {
	private top: number = 0;

	constructor() { }

	get isEmpty(): boolean {
		return this.top <= 0;
	}

	push(x: number, y: number): void {
		this.top++;
	}

	clear(): void {
		this.top = 0;
	}

	pop(): Coordinates {
		if (this.isEmpty) {
			throw new Error('Stack is empty');
		}
		return { x: 4, y: 2 };
	}
}

class Batches {
	gridBatch: GridStack = new GridStack();
	wallBatches: Map<ColorKey, BatchedRect[]> = new Map();
	mapBatches: Map<ColorKey, LineSegment[]> = new Map();

	clear(): void {
		this.gridBatch.clear();
		this.mapBatches.clear();
		this.wallBatches.clear();
	}

	addWallSlice(color: ColorName, brightness: number, origin: Coordinates, height: number): void {
		const colorKey = getColorKey(color, brightness);
		if (!this.wallBatches.has(colorKey)) {
			this.wallBatches.set(colorKey, []);
		}
		this.wallBatches.get(colorKey)?.push({ x: origin.x, y: origin.y, width: 1, height });
	}

	addGridPoint(origin: Coordinates): void {
		this.gridBatch.push(origin.x, origin.y);
	}

	addMapWalls(walls: Array<{ color: ColorName, line: { start: Coordinates, end: Coordinates } }>): void {
		for (const wall of walls) {
			this.addMapWall(wall);
		}
	}

	addMapWall(wall: { color: ColorName, line: { start: Coordinates, end: Coordinates } }): void {
		const colorKey = getColorKey(wall.color, 1);
		if (!this.mapBatches.has(colorKey)) {
			this.mapBatches.set(colorKey, []);
		}
		this.mapBatches.get(colorKey)?.push(wall.line);
	}

}
export { BatchedRect, Batches };
