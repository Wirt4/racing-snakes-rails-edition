import { Coordinates, LineSegment } from "../geometry/interfaces";
import { ColorName } from "./color/color_name";

type BatchedRect = { x: number, y: number, width: number, height: number };

export class Batches {
	gridBatch: BatchedRect[] = [];
	private wallHash: HashBatch = new HashBatch();
	private mapHash: HashBatch = new HashBatch();

	get wallBatches(): Record<string, BatchedRect[]> {
		return this.wallHash.record;
	}
	get mapBatches(): Record<string, LineSegment[]> {
		return this.mapHash.record;
	}
	addWallSlice(color: string, brightness: number, origin: Coordinates, height: number): void {
		this.wallHash.add(`${color}_${brightness}`, { x: origin.x, y: origin.y, width: 1, height });
	}

	addGridPoint(origin: Coordinates): void {
		this.gridBatch.push({ x: origin.x, y: origin.y, width: 1, height: 1 });
	}

	addMapWall(wall: { color: ColorName, line: { start: Coordinates, end: Coordinates } }): void {
		this.mapHash.add(`${wall.color}_0.5`, wall.line);
	}

	unpackKey(key: string): { color: ColorName, intensity: number } {
		const [color, weight] = key.split("_");
		return { color: color as ColorName, intensity: Number(weight) };
	}
}

class HashBatch {
	record: Record<string, Array<any>> = {};

	add(key: string, value: any): void {
		if (!this.record[key]) this.record[key] = [];
		this.record[key].push(value);
	}

}
