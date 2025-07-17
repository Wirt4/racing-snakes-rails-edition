import { Coordinates, LineSegment } from "../geometry/interfaces";
import { ColorName } from "../color/color_name";
import { getColorKey, ColorKey } from "../game/color_key_cache";
import { ObjectPool } from "../game/objectPool";
interface BatchedRect { x: number, y: number, width: number, height: number };

class CoordinatesStack {
	private top: number;
	private stck: Array<Coordinates>;
	private pool: ObjectPool<Coordinates>;
	constructor(size: number = 1500) {
		this.pool = new ObjectPool<Coordinates>(size, () => ({ x: -1, y: -1 }));
		this.top = 0;
		this.stck = new Array(size);
		this.fillStack(this.stck, 0, size);
	}

	get isEmpty(): boolean {
		return this.top === 0;
	}

	push(x: number, y: number): void {
		this.reallocateIfNecessary();
		this.stck[this.top].x = x;
		this.stck[this.top].y = y;
		this.top++;
	}

	clear(): void {
		for (let i = 0; i < this.top; i++) {
			this.pool.release(this.stck[i]);
		}
		this.top = 0;
	}

	pop(): Coordinates {
		if (this.isEmpty) {
			throw new Error('Stack is empty');
		}
		this.top--;
		return this.stck[this.top];
	}

	private reallocateIfNecessary(): void {
		if (this.top >= this.stck.length) {
			this.reallocate();
		}
	}

	private reallocate(): void {
		const newSize = this.stck.length * 2;
		const newStack = new Array(newSize);
		this.fillStack(newStack, this.stck.length, newSize);
		this.copyInto(newStack, this.stck, this.stck.length);
		this.stck = newStack;
	}

	private copyInto(target: Array<Coordinates>, source: Array<Coordinates>, size: number): void {
		for (let i = 0; i < size; i++) {
			target[i] = source[i];
		}
	}

	private fillStack(stack: Array<Coordinates>, start: number, length: number): void {
		for (let i = start; i < length; i++) {
			stack[i] = this.pool.acquire();
		}
	}
}

class Batches {
	gridBatch: CoordinatesStack = new CoordinatesStack();
	wallBatches: Map<ColorKey, BatchedRect[]> = new Map();
	mapBatches: Map<ColorKey, LineSegment[]> = new Map();

	private rectPool: ObjectPool<BatchedRect> = new ObjectPool<BatchedRect>(1500, () => ({ x: -1, y: -1, width: -1, height: -1 }));
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

}

export { BatchedRect, Batches, CoordinatesStack };
