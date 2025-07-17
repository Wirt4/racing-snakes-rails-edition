import { Batches } from '../batches/batches';
class BatchCorrelator {
    constructor(gameMap, raycaster, maxDistance, horizonY, cameraHeight, wallHeight, brightness, resolution) {
        this.raycaster = raycaster;
        this.maxDistance = maxDistance;
        this.horizonY = horizonY;
        this.cameraHeight = cameraHeight;
        this.wallHeight = wallHeight;
        this.brightness = brightness;
        this.resolution = resolution;
        this.rays = new Float32Array(resolution);
        this.batches = new Batches();
        this._gameMap = gameMap;
    }
    batchRenderData() {
        this.batches.clear();
        if (!this.rays)
            this.rays = new Float32Array(this.resolution);
        this.raycaster.fillRaysInto(this.rays, this._gameMap.playerAngle);
        this.appendAllSlices();
        this.batches.addMapWalls(this._gameMap.walls);
        this.batches.addMapWalls(this._gameMap.playerTrail);
    }
    appendAllSlices() {
        for (let i = 0; i < this.rays.length; i++) {
            this.appendSlice(i);
        }
    }
    appendSlice(index) {
        const angle = this.rays[index];
        this.appendWallSlice(angle, index);
        this.appendGridSlice(angle, index);
    }
    appendWallSlice(angle, index) {
        const { distance, color } = this.getAdjustedDistance(angle);
        const slice = this.sliceHeight(distance);
        const wallBrightness = this.brightness.calculateBrightness(distance);
        this.batches.addWallSlice(color, wallBrightness, index, slice.origin, slice.magnitude);
    }
    appendGridSlice(angle, index) {
        const { gridHits } = this._gameMap.castRay(angle, this.maxDistance);
        for (let j = 0; j < gridHits.length; j++) {
            this.appendGridPoint(gridHits[j], angle, index);
        }
    }
    getAdjustedDistance(angle) {
        const { distance, color } = this._gameMap.castRay(angle, this.maxDistance);
        const correctedDistance = this.raycaster.removeFishEye(distance, angle, this._gameMap.playerAngle);
        return { distance: correctedDistance, color };
    }
    sliceHeight(distance) {
        const wallTopOffset = this.wallHeight - this.cameraHeight;
        const wallBottomOffset = -this.cameraHeight;
        const topY = this.horizonY - (wallTopOffset * this.raycaster.focalLength) / distance;
        const bottomY = this.horizonY - (wallBottomOffset * this.raycaster.focalLength) / distance;
        return { origin: topY, magnitude: bottomY - topY };
    }
    appendGridPoint(gridHit, angle, index) {
        const distance = this.raycaster.removeFishEye(gridHit, angle, this._gameMap.playerAngle);
        const y = this.floorPoint(distance);
        this.batches.addGridPoint({ x: index, y });
    }
    floorPoint(distance) {
        const floorOffset = -this.cameraHeight;
        return this.horizonY - (floorOffset * this.raycaster.focalLength) / distance;
    }
}
export { BatchCorrelator };
