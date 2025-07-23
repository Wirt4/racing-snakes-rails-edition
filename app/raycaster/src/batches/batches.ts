import { Coordinates, LineSegment } from "../geometry/interfaces";
import { ColorName } from "../color/color_name";
import { getColorKey, ColorKey } from "../color_key/color_key_cache";
import { ObjectPool } from "../objectPool/objectPool";
import { CoordinatesStack } from "../CoordinatesStack/coordinatesStack";
import { WallInterface } from "../gamemap/interface";
import { BatchesInterface } from "./interface";
import { BatchedRect } from "./rectInterface";

class Batches implements BatchesInterface {
	gridBatch: CoordinatesStack = new CoordinatesStack();
	wallBatches: Map<ColorKey, BatchedRect[]> = new Map();
	mapBatches: Map<ColorKey, LineSegment[]> = new Map();
	private rectPool: ObjectPool<BatchedRect> = new ObjectPool<BatchedRect>(1500, Batches.defaultRect);

	constructor(private rectWidth = 1) { }

	clear(): void {
		this.gridBatch.clear();
		this.mapBatches.clear();
		this.wallBatches.clear();
	}

	addWallSlice(color: ColorName, brightness: number, x: number, y: number, height: number): void {
		const colorKey = getColorKey(color, this.quantizeBrigtness(brightness));
		this.setIfNecessary(colorKey);
		this.wallBatches.get(colorKey)?.push(this.toRect(x, y, this.rectWidth, height));
	}

	releaseSlice(rect: BatchedRect): void {
		this.rectPool.release(rect);
	}

	addGridPoint(origin: Coordinates): void {
		this.gridBatch.push(origin.x, origin.y);
	}

	addMapWalls(walls: Array<WallInterface>): void {
		for (const wall of walls) {
			this.addMapWall(wall);
		}
	}

	addMapWall(wall: WallInterface): void {
		const colorKey = getColorKey(wall.color, 1);
		if (!this.mapBatches.has(colorKey)) {
			this.mapBatches.set(colorKey, []);
		}
		this.mapBatches.get(colorKey)?.push(wall.line);
	}

	private quantizeBrigtness(brightness: number): number {
		const levels = 16;
		return Math.round(brightness * levels) / levels;
	}

	private static defaultRect(): BatchedRect {
		return { x: -1, y: -1, width: -1, height: -1 };
	}

	private setIfNecessary(colorKey: ColorKey): void {
		if (!this.wallBatches.has(colorKey)) {
			this.wallBatches.set(colorKey, []);
		}
	}

	private toRect(x: number, y: number, width: number, height: number): BatchedRect {
		const rect = this.rectPool.acquire();
		rect.x = x;
		rect.y = y;
		rect.width = width;
		rect.height = height;
		return rect;
	}
}

export { BatchedRect, Batches };
