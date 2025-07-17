import { getColorKey } from "../color_key/color_key_cache";
import { ObjectPool } from "../objectPool/objectPool";
;
class CoordinatesStack {
    constructor(size = 1500) {
        this.pool = new ObjectPool(size, () => ({ x: -1, y: -1 }));
        this.top = 0;
        this.stck = new Array(size);
        this.fillStack(this.stck, 0, size);
    }
    get isEmpty() {
        return this.top === 0;
    }
    push(x, y) {
        this.reallocateIfNecessary();
        this.stck[this.top].x = x;
        this.stck[this.top].y = y;
        this.top++;
    }
    clear() {
        for (let i = 0; i < this.top; i++) {
            this.pool.release(this.stck[i]);
        }
        this.top = 0;
    }
    pop() {
        if (this.isEmpty) {
            throw new Error('Stack is empty');
        }
        this.top--;
        return this.stck[this.top];
    }
    reallocateIfNecessary() {
        if (this.top >= this.stck.length) {
            this.reallocate();
        }
    }
    reallocate() {
        const newSize = this.stck.length * 2;
        const newStack = new Array(newSize);
        this.fillStack(newStack, this.stck.length, newSize);
        this.copyInto(newStack, this.stck, this.stck.length);
        this.stck = newStack;
    }
    copyInto(target, source, size) {
        for (let i = 0; i < size; i++) {
            target[i] = source[i];
        }
    }
    fillStack(stack, start, length) {
        for (let i = start; i < length; i++) {
            stack[i] = this.pool.acquire();
        }
    }
}
class Batches {
    constructor() {
        this.gridBatch = new CoordinatesStack();
        this.wallBatches = new Map();
        this.mapBatches = new Map();
        this.rectPool = new ObjectPool(1500, () => ({ x: -1, y: -1, width: -1, height: -1 }));
    }
    clear() {
        this.gridBatch.clear();
        this.mapBatches.clear();
        this.wallBatches.clear();
    }
    addWallSlice(color, brightness, x, y, height) {
        const quantized = Math.round(brightness * 16) / 16; // Quantize brightness to 16 levels
        const colorKey = getColorKey(color, quantized);
        if (!this.wallBatches.has(colorKey)) {
            this.wallBatches.set(colorKey, []);
        }
        const rect = this.rectPool.acquire();
        rect.x = x;
        rect.y = y;
        rect.width = 1; // Assuming a width of 1 for each wall slice
        rect.height = height;
        this.wallBatches.get(colorKey)?.push(rect);
    }
    releaseSlice(rect) {
        this.rectPool.release(rect);
    }
    addGridPoint(origin) {
        this.gridBatch.push(origin.x, origin.y);
    }
    addMapWalls(walls) {
        for (const wall of walls) {
            this.addMapWall(wall);
        }
    }
    addMapWall(wall) {
        const colorKey = getColorKey(wall.color, 1);
        if (!this.mapBatches.has(colorKey)) {
            this.mapBatches.set(colorKey, []);
        }
        this.mapBatches.get(colorKey)?.push(wall.line);
    }
}
export { Batches, CoordinatesStack };
