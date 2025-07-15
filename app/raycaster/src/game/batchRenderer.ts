import { ContextRendererInterface } from '../renderer/interface';
import { ColorName } from './color/color_name';
import { GameMapInterface } from '../gamemap/interface';
import { Batches, BatchedRect } from './batches';
import { LineSegment } from '../geometry/interfaces';
import { RaycasterInterface } from '../raycaster/interface';
import { BrightnessInterface } from '../brightness/interface';


class BatchCorrelator {
	public batches: Batches;
	private rays: Float32Array;
	private gameMap: GameMapInterface | null = null;

	constructor(
		private raycaster: RaycasterInterface,
		private maxDistance: number,
		private horizonY: number,
		private cameraHeight: number,
		private wallHeight: number,
		private brightness: BrightnessInterface,
		resolution: number
	) {
		this.rays = new Float32Array(resolution);
		this.batches = new Batches();
	}

	public setGameMap(gameMap: GameMapInterface) {
		this.batches = new Batches();
		this.gameMap = gameMap;
	}

	public batchRenderData(): void {
		if (!this.gameMap) {
			throw new Error('Game map is not set.');
		}
		this.rays = this.raycaster.getViewRays(this.gameMap.playerAngle);
		this.appendAllSlices();
		this.batches.addMapWalls(this.gameMap.walls);
		this.batches.addMapWalls(this.gameMap.playerTrail);
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
		this.batches.addWallSlice(color, wallBrightness, { x: index, y: slice.origin }, slice.magnitude);
	}

	private appendGridSlice(
		angle: number,
		index: number,
	): void {
		if (!this.gameMap) {
			throw new Error('Game map is not set.');
		}
		const { gridHits } = this.gameMap.castRay(angle, this.maxDistance);
		for (let j = 0; j < gridHits.length; j++) {
			this.appendGridPoint(gridHits[j], angle, index);
		}
	}

	private getAdjustedDistance(angle: number): { distance: number, color: ColorName } {
		if (!this.gameMap) {
			throw new Error('Game map is not set.');
		}
		const { distance, color } = this.gameMap.castRay(angle, this.maxDistance);
		const correctedDistance = this.raycaster.removeFishEye(distance, angle, this.gameMap.playerAngle);
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
		if (!this.gameMap) {
			throw new Error('Game map is not set.');
		}
		const distance = this.raycaster.removeFishEye(gridHit, angle, this.gameMap.playerAngle);
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
		for (const [key, rects] of Object.entries(this._batches.wallBatches)) {
			this.unpackAndRender(key, rects);
		}
	}

	private unpackAndRender(
		key: string,
		rects: BatchedRect[],
	): void {
		const { color, intensity: brightnessValue } = this._batches.unpackKey(key);
		this.contextRenderer.fillColor(color, brightnessValue);
		this.renderRects(rects);
	}

	private renderGrid(): void {
		this.contextRenderer.fillColor(this.gridColor, 50);
		this._batches.gridBatch.forEach(rectSpec => this.renderRect(rectSpec));
	}

	private renderRects(rects: BatchedRect[]): void {
		rects.forEach(rect => this.renderRect(rect));
	}

	private renderRect(rectSpec: BatchedRect): void {
		this.contextRenderer.rect({ x: rectSpec.x, y: rectSpec.y }, rectSpec.width, rectSpec.height);
	}

	private renderHUDMap(): void {
		for (const [key, lines] of Object.entries(this._batches.mapBatches)) {
			this.renderHUDLines(key, lines);
		}
	}

	private renderHUDLines(
		key: string,
		lines: LineSegment[]
	): void {
		const { color, intensity: weight } = this._batches.unpackKey(key)
		this.contextRenderer.stroke(color);
		this.contextRenderer.strokeWeight(weight);
		lines.forEach(line => this.contextRenderer.line(line));
	}
}
export { BatchCorrelator, BatchRenderer };
