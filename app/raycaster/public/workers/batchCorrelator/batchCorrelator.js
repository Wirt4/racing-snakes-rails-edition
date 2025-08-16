import { Batches } from '../batches/batches';
import { ColorName } from '../color/color_name';
class BatchCorrelator {
    constructor(gameMap, raycaster, maxDistance, horizonY, cameraHeight, wallHeight, brightness, resolution) {
        this.gameMap = gameMap;
        this.raycaster = raycaster;
        this.maxDistance = maxDistance;
        this.horizonY = horizonY;
        this.cameraHeight = cameraHeight;
        this.wallHeight = wallHeight;
        this.brightness = brightness;
        this.resolution = resolution;
        this.currentAngle = 0;
        this.index = 0;
        this.rays = new Float32Array(resolution);
        this.batches = new Batches();
        this.wallBottomOffset = -this.cameraHeight;
        this.wallTopOffset = this.wallHeight + this.wallBottomOffset;
    }
    batchRenderData() {
        this.batches.clear();
        this.setRays();
        this.appendAllSlices();
        this.appendAllMapWalls();
    }
    appendAllMapWalls() {
        this.batches.addMapWalls(this.gameMap.walls);
        this.batches.addMapWalls(this.gameMap.player.trail);
    }
    setRays() {
        if (!this.rays) {
            this.rays = new Float32Array(this.resolution);
        }
        this.raycaster.fillRaysInto(this.rays, this.gameMap.player.angle);
    }
    appendAllSlices() {
        this.index = 0;
        while (this.index < this.rays.length) {
            this.appendSlice();
            this.index += 1;
        }
    }
    appendSlice() {
        this.currentAngle = this.rays[this.index];
        this.appendWallSlice();
        this.appendGridSlice();
    }
    appendWallSlice() {
        const { distance, color } = this.getAdjustedDistance();
        const slice = this.sliceHeight(distance);
        const wallBrightness = this.brightness.calculateBrightness(distance);
        this.batches.addWallSlice(color, wallBrightness, this.index, slice.origin, slice.magnitude);
    }
    appendGridSlice() {
        const slice = this.raycaster.castRay({ x: this.gameMap.player.x, y: this.gameMap.player.y }, this.currentAngle, this.gameMap.walls, this.gameMap.arena.gridLines);
        if (slice !== null) {
            const { gridHits } = slice;
            for (let j = 0; j < gridHits.length; j++) {
                this.appendGridPoint(gridHits[j]);
            }
        }
    }
    getAdjustedDistance() {
        const slice = this.raycaster.castRay({ x: this.gameMap.player.x, y: this.gameMap.player.y }, this.currentAngle, this.gameMap.walls, this.gameMap.arena.gridLines);
        if (slice !== null) {
            const { distance, color } = slice;
            const correctedDistance = this.removeFishEye(distance);
            return { distance: correctedDistance, color };
        }
        return { distance: -1, color: ColorName.NONE };
    }
    removeFishEye(distance) {
        return this.raycaster.removeFishEye(distance, this.currentAngle, this.gameMap.player.angle);
    }
    sliceHeight(distance) {
        const topY = this.getY(this.wallTopOffset, distance);
        const bottomY = this.getY(this.wallBottomOffset, distance);
        return { origin: topY, magnitude: bottomY - topY };
    }
    getY(offset, distance) {
        return this.horizonY - (offset * this.raycaster.focalLength) / distance;
    }
    appendGridPoint(gridHit) {
        const distance = this.removeFishEye(gridHit);
        this.batches.addGridPoint({ x: this.index, y: this.floorPoint(distance) });
    }
    floorPoint(distance) {
        return this.getY(-this.cameraHeight, distance);
    }
}
export { BatchCorrelator };
