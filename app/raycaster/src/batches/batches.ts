import { Coordinates, LineSegment } from "../geometry/interfaces";
import { ColorName } from "../color/color_name";
import { getColorKey, ColorKey } from "../color_key/color_key_cache";
import { ObjectPool } from "../objectPool/objectPool";
import { CoordinatesStack } from "../CoordinatesStack/coordinatesStack";

interface BatchedRect { x: number, y: number, width: number, height: number };

class Batches {
	gridBatch: CoordinatesStack = new CoordinatesStack();
	wallBatches: Map<ColorKey, BatchedRect[]> = new Map();
	mapBatches: Map<ColorKey, LineSegment[]> = new Map();
	private rectPool: ObjectPool<BatchedRect> = new ObjectPool<BatchedRect>(1500, Batches.defaultRect);

	clear(): void {
		this.gridBatch.clear();
		this.mapBatches.clear();
		this.wallBatches.clear();
	}

	addWallSlice(color: ColorName, brightness: number, x: number, y: number, height: number): void {
		const quantized = Math.round(brightness * 16) / 16; // Quantize brightness to 16 levels
		const colorKey = getColorKey(color, quantized);
		if (!this.wallBatches.has(colorKey)) {
			this.wallBatches.set(colorKey, []);
		}
		const rect = this.rectPool.acquire()
		rect.x = x;
		rect.y = y;
		rect.width = 1; // Assuming a width of 1 for each wall slice
		rect.height = height;
		this.wallBatches.get(colorKey)?.push(rect);
	}

	releaseSlice(rect: BatchedRect): void {
		this.rectPool.release(rect);
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

	private static defaultRect(): BatchedRect {
		return { x: -1, y: -1, width: -1, height: -1 };
	}

}

export { BatchedRect, Batches };
