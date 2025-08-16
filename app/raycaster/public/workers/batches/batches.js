import { getColorKey } from "../color_key/color_key_cache";
import { ObjectPool } from "../objectPool/objectPool";
import { CoordinatesStack } from "../CoordinatesStack/coordinatesStack";
class Batches {
    constructor(rectWidth = 1) {
        this.rectWidth = rectWidth;
        this.gridBatch = new CoordinatesStack();
        this.wallBatches = new Map();
        this.mapBatches = new Map();
        this.rectPool = new ObjectPool(1500, Batches.defaultRect);
    }
    clear() {
        this.gridBatch.clear();
        this.mapBatches.clear();
        this.wallBatches.clear();
    }
    addWallSlice(color, brightness, x, y, height) {
        const colorKey = getColorKey(color, this.quantizeBrigtness(brightness));
        this.setIfNecessary(colorKey);
        this.wallBatches.get(colorKey)?.push(this.toRect(x, y, this.rectWidth, height));
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
    quantizeBrigtness(brightness) {
        const levels = 16;
        return Math.round(brightness * levels) / levels;
    }
    static defaultRect() {
        return { x: -1, y: -1, width: -1, height: -1 };
    }
    setIfNecessary(colorKey) {
        if (!this.wallBatches.has(colorKey)) {
            this.wallBatches.set(colorKey, []);
        }
    }
    toRect(x, y, width, height) {
        const rect = this.rectPool.acquire();
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
        return rect;
    }
}
export { Batches };
