import { Batches } from '../batches/batches';
import { ColorName } from '../color/color_name';
import { RaycasterInterface } from '../raycaster/interface';
import { BrightnessInterface } from '../brightness/interface';
import { GameMapInterface } from '../gamemap/interface';

class BatchCorrelator {
	public batches: Batches;
	private rays: Float32Array;
	private _gameMap: GameMapInterface;

	constructor(
		gameMap: GameMapInterface,
		private raycaster: RaycasterInterface,
		private maxDistance: number,
		private horizonY: number,
		private cameraHeight: number,
		private wallHeight: number,
		private brightness: BrightnessInterface,
		private resolution: number
	) {
		this.rays = new Float32Array(resolution);
		this.batches = new Batches();
		this._gameMap = gameMap;
	}

	public batchRenderData(): void {
		this.batches.clear();
		if (!this.rays) this.rays = new Float32Array(this.resolution);
		this.raycaster.fillRaysInto(this.rays, this._gameMap.playerAngle);

		this.appendAllSlices();
		this.batches.addMapWalls(this._gameMap.walls);
		this.batches.addMapWalls(this._gameMap.playerTrail);
	}

	private appendAllSlices(): void {
		for (let i = 0; i < this.rays.length; i++) {
			this.appendSlice(i);
		}
	}

	private appendSlice(index: number): void {
		const angle = this.rays[index];
		this.appendWallSlice(angle, index);
		this.appendGridSlice(angle, index);
	}

	private appendWallSlice(
		angle: number,
		index: number,
	): void {
		const { distance, color } = this.getAdjustedDistance(angle);
		const slice = this.sliceHeight(distance);
		const wallBrightness = this.brightness.calculateBrightness(distance);
		this.batches.addWallSlice(color, wallBrightness, index, slice.origin, slice.magnitude);
	}

	private appendGridSlice(
		angle: number,
		index: number,
	): void {
		const { gridHits } = this._gameMap.castRay(angle, this.maxDistance);
		for (let j = 0; j < gridHits.length; j++) {
			this.appendGridPoint(gridHits[j], angle, index);
		}
	}

	private getAdjustedDistance(angle: number): { distance: number, color: ColorName } {
		const { distance, color } = this._gameMap.castRay(angle, this.maxDistance);
		const correctedDistance = this.raycaster.removeFishEye(distance, angle, this._gameMap.playerAngle);
		return { distance: correctedDistance, color };
	}

	private sliceHeight(
		distance: number,
	): { origin: number, magnitude: number } {
		const wallTopOffset = this.wallHeight - this.cameraHeight;
		const wallBottomOffset = -this.cameraHeight;
		const topY = this.horizonY - (wallTopOffset * this.raycaster.focalLength) / distance;
		const bottomY = this.horizonY - (wallBottomOffset * this.raycaster.focalLength) / distance;
		return { origin: topY, magnitude: bottomY - topY }
	}

	private appendGridPoint(
		gridHit: number,
		angle: number,
		index: number,
	): void {
		const distance = this.raycaster.removeFishEye(gridHit, angle, this._gameMap.playerAngle);
		const y = this.floorPoint(distance);
		this.batches.addGridPoint({ x: index, y });
	}

	private floorPoint(distance: number): number {
		const floorOffset = -this.cameraHeight;
		return this.horizonY - (floorOffset * this.raycaster.focalLength) / distance;
	}
}

export { BatchCorrelator };
