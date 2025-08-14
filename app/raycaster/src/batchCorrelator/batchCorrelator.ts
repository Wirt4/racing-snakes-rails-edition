import { Batches } from '../batches/batches';
import { ColorName } from '../color/color_name';
import { RaycasterInterface } from '../raycaster/interface';
import { BrightnessInterface } from '../brightness/interface';
import { GameMapInterface } from '../gamemap/interface';

class BatchCorrelator {
	public batches: Batches;
	private rays: Float32Array;
	private wallTopOffset: number;
	private wallBottomOffset: number;
	private currentAngle: number = 0;
	private index: number = 0;

	constructor(
		private gameMap: GameMapInterface,
		private raycaster: RaycasterInterface,
		private maxDistance: number,
		private horizonY: number,
		private cameraHeight: number,
		private wallHeight: number,
		private brightness: BrightnessInterface,
		private resolution: number,

	) {
		this.rays = new Float32Array(resolution);
		this.batches = new Batches();
		this.wallBottomOffset = -this.cameraHeight;
		this.wallTopOffset = this.wallHeight + this.wallBottomOffset;
	}

	public batchRenderData(): void {
		this.batches.clear();
		this.setRays();
		this.appendAllSlices();
		this.appendAllMapWalls();
	}

	private appendAllMapWalls(): void {
		this.batches.addMapWalls(this.gameMap.walls);
		this.batches.addMapWalls(this.gameMap.player.trail);
	}

	private setRays(): void {
		if (!this.rays) {
			this.rays = new Float32Array(this.resolution);
		}
		this.raycaster.fillRaysInto(this.rays, this.gameMap.player.angle);
	}

	private appendAllSlices(): void {
		this.index = 0;
		while (this.index < this.rays.length) {
			this.appendSlice();
			this.index += 1;
		}
	}

	private appendSlice(): void {
		this.currentAngle = this.rays[this.index];
		this.appendWallSlice();
		this.appendGridSlice();
	}

	private appendWallSlice(): void {
		const { distance, color } = this.getAdjustedDistance();
		const slice = this.sliceHeight(distance);
		const wallBrightness = this.brightness.calculateBrightness(distance);
		this.batches.addWallSlice(color, wallBrightness, this.index, slice.origin, slice.magnitude);
	}

	private appendGridSlice(): void {
		const slice = this.raycaster.castRay(
			{ x: this.gameMap.player.x, y: this.gameMap.player.y },
			this.currentAngle, this.gameMap.walls,
			this.gameMap.arena.gridLines
		)
		if (slice !== null) {
			const { gridHits } = slice;
			for (let j = 0; j < gridHits.length; j++) {
				this.appendGridPoint(gridHits[j]);
			}
		}
	}

	private getAdjustedDistance(): { distance: number, color: ColorName } {
		//don't use the player angle, ??
		const slice = this.raycaster.castRay(
			{ x: this.gameMap.player.x, y: this.gameMap.player.y },
			this.currentAngle, this.gameMap.walls,
			this.gameMap.arena.gridLines
		)
		if (slice !== null) {
			const { distance, color } = slice;
			const correctedDistance = this.removeFishEye(distance);
			return { distance: correctedDistance, color };

		}
		return { distance: -1, color: ColorName.NONE }

	}

	private removeFishEye(distance: number): number {
		return this.raycaster.removeFishEye(distance, this.currentAngle, this.gameMap.player.angle);
	}

	private sliceHeight(
		distance: number,
	): { origin: number, magnitude: number } {
		const topY = this.getY(this.wallTopOffset, distance);
		const bottomY = this.getY(this.wallBottomOffset, distance);
		return { origin: topY, magnitude: bottomY - topY }
	}

	private getY(offset: number, distance: number): number {
		return this.horizonY - (offset * this.raycaster.focalLength) / distance;
	}

	private appendGridPoint(gridHit: number): void {
		const distance = this.removeFishEye(gridHit);
		this.batches.addGridPoint({ x: this.index, y: this.floorPoint(distance) });
	}

	private floorPoint(distance: number): number {
		return this.getY(-this.cameraHeight, distance);
	}
}

export { BatchCorrelator };
