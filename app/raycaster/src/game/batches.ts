import { Coordinates } from "../geometry/interfaces";
import { ColorName } from "./color/color_name";

type BatchedRect = { x: number, y: number, width: number, height: number };

export class Batches {
	wallBatches: Record<string, BatchedRect[]> = {};
	gridBatch: BatchedRect[] = [];
	addWallSlice(color: string, brightness: number, origin: Coordinates, height: number): void {
		const key = `${color}_${Math.round(brightness * 100)}`;
		if (!this.wallBatches[key]) this.wallBatches[key] = [];
		this.wallBatches[key].push({ x: origin.x, y: origin.y, width: 1, height });
	}
	addGridPoint(origin: Coordinates): void {
		this.gridBatch.push({ x: origin.x, y: origin.y, width: 1, height: 1 });
	}

	unpackKey(key: string): { color: ColorName, brightness: number } {
		const [color, brightness] = key.split("_");
		return { color: color as ColorName, brightness: Number(brightness) / 100 };
	}
}
