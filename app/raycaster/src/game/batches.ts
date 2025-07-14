import { Coordinates, LineSegment } from "../geometry/interfaces";
import { ColorName } from "./color/color_name";

type BatchedRect = { x: number, y: number, width: number, height: number };

export class Batches {
	wallBatches: Record<string, BatchedRect[]> = {};
	gridBatch: BatchedRect[] = [];
	mapBatches: Record<string, LineSegment[]> = {};

	addWallSlice(color: string, brightness: number, origin: Coordinates, height: number): void {
		const key = `${color}_${brightness}`;
		if (!this.wallBatches[key]) this.wallBatches[key] = [];
		this.wallBatches[key].push({ x: origin.x, y: origin.y, width: 1, height });
	}
	addGridPoint(origin: Coordinates): void {
		this.gridBatch.push({ x: origin.x, y: origin.y, width: 1, height: 1 });
	}

	unpackWallKey(key: string): { color: ColorName, brightness: number } {
		const { color, weight } = this.unpackMapKey(key);
		return { color, brightness: weight };
	}

	addMapWall(wall: { color: ColorName, line: { start: Coordinates, end: Coordinates } }): void {
		const key = `${wall.color}_0.5`;
		if (!this.mapBatches[key]) this.mapBatches[key] = [];
		this.mapBatches[key].push(wall.line);
	}

	unpackMapKey(key: string): { color: ColorName, weight: number } {
		const [color, weight] = key.split("_");
		return { color: color as ColorName, weight: Number(weight) };
	}
}
