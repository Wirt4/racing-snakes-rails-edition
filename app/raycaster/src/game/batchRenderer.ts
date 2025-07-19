import { ContextRendererInterface } from '../renderer/interface';
import { ColorName } from '../color/color_name';
import { GameMapInterface } from '../gamemap/interface';
import { Batches, BatchedRect } from '../batches/batches';
import { LineSegment } from '../geometry/interfaces';
import { RaycasterInterface } from '../raycaster/interface';
import { BrightnessInterface } from '../brightness/interface';
import { ColorKey } from './color_key_cache';

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

class BatchRenderer {
	private _batches: Batches = new Batches();
	constructor(
		private contextRenderer: ContextRendererInterface,
		private canvasWidth: number,
		private canvasHeight: number,
		private gridColor: ColorName,
	) { }

	set batches(batches: Batches) {
		this._batches = batches;
	}

	public renderSlices(): void {
		this.renderBackground();
		this.renderWalls()
		this.renderGrid();
	}

	public renderHUD(): void {
		this.contextRenderer.save();
		this.renderHUDMap();
		this.contextRenderer.restore()
	}

	private renderBackground(): void {
		this.contextRenderer.fillColor(this.gridColor, 0);
		this.contextRenderer.rect({ x: 0, y: 0 }, this.canvasWidth, this.canvasHeight);
	}

	private renderWalls(): void {
		//??
		for (const [key, rects] of this._batches.wallBatches.entries()) {
			this.unpackAndRender(key, rects); // key is now a structured object
		}
	}

	private unpackAndRender(
		key: ColorKey,
		rects: BatchedRect[],
	): void {
		this.contextRenderer.fillColor(key.color, key.intensity);
		this.renderRects(rects);
	}

	private renderGrid(): void {
		this.contextRenderer.fillColor(this.gridColor, 50);
		// use a preallocated array and a basic Knuth style stack with a pointer to track i
		// // use a preallocated array and a basic Knuth style stack with a pointer to track it
		if (this._batches.gridBatch.isEmpty) return;
		const path = new Path2D();
		while (!this._batches.gridBatch.isEmpty) {
			const rectSpec = this._batches.gridBatch.top;
			path.rect(rectSpec.x, rectSpec.y, 1, 1);
			this._batches.gridBatch.freetop();
		}
		this.contextRenderer.fillColor(this.gridColor, 50);
		this.contextRenderer.fillPath(path);
	}

	private renderRects(rects: BatchedRect[]): void {
		const path = new Path2D();
		for (const { x, y, width, height } of rects) {
			path.rect(x, y, width, height);
		}
		this.contextRenderer.fillPath(path);
	}

	private renderHUDMap(): void {
		for (const [key, rects] of this._batches.mapBatches.entries()) {
			this.renderHUDLines(key, rects);
		}
	}

	private renderHUDLines(
		key: ColorKey,
		lines: LineSegment[]
	): void {
		const { color, intensity: weight } = key;
		if (color === ColorName.NONE) return;
		this.contextRenderer.stroke(color);
		this.contextRenderer.strokeWeight(weight);
		lines.forEach(line => this.contextRenderer.line(line));
	}
}
export { BatchCorrelator, BatchRenderer };
