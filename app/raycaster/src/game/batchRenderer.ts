import { ContextRendererInterface } from '../renderer/interface';
import { ColorName } from './color/color_name';
import { Settings } from '../settings';
import { GameMapInterface } from '../gamemap/interface';
import { Batches, BatchedRect } from './batches';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { RaycasterInterface } from '../raycaster/interface';
import { BrightnessInterface } from '../brightness/interface';

export class BatchRenderer {
	private rays: Float32Array;
	private batches: Batches = new Batches();

	constructor(
		private contextRenderer: ContextRendererInterface,
		private raycaster: RaycasterInterface,
		private brightness: BrightnessInterface,
		private horizonY: number,
		resolution: number
	) {
		this.rays = new Float32Array(resolution);
	}

	public batchSlices(gameMap: GameMapInterface): void {
		this.batches = new Batches();
		this.batchRenderData(gameMap);
	}

	public renderSlices(): void {
		this.renderBackround();
		this.renderWalls()
		this.renderGrid();

	}

	public batchHUD(gameMap: GameMapInterface): void {
		this.batches.addMapWalls(gameMap.walls);
		this.batches.addMapWalls(gameMap.playerTrail);

	}

	public renderHUD(gameMap: GameMapInterface): void {
		this.contextRenderer.save();
		this.renderHUDMap();
		this.renderPlayer(gameMap);
		this.contextRenderer.restore()
	}

	private renderHUDMap(): void {
		for (const [key, lines] of Object.entries(this.batches.mapBatches)) {
			this.renderHUDLines(key, lines);
		}
	}
	private renderHUDLines(
		key: string,
		lines: LineSegment[]
	): void {
		const { color, intensity: weight } = this.batches.unpackKey(key)
		this.contextRenderer.stroke(color);
		this.contextRenderer.strokeWeight(weight);
		lines.forEach(line => this.contextRenderer.line(line));
	}

	private renderPlayer(map: GameMapInterface): void {
		this.setPlayerContext();
		this.contextRenderer.ellipse(map.playerPosition, 0.2);
		this.draw2DRays(map);
	}
	private draw2DRays(gameMap: GameMapInterface): void {
		this.contextRenderer.stroke(ColorName.GREEN);
		this.contextRenderer.strokeWeight(0.05);
		for (let index = 0; index < Settings.CANVAS_WIDTH; index++) {
			const angle = this.rays[index];
			const { distance } = gameMap.castRay(angle, Settings.MAX_DISTANCE);
			const hit = this.pointOnTrajectory(gameMap.playerPosition, angle, distance);
			this.contextRenderer.line({ start: gameMap.playerPosition, end: hit });
		}
	}
	private pointOnTrajectory(coordinates: Coordinates, angle: number, distance: number): Coordinates {
		return {
			x: coordinates.x + Math.cos(angle) * distance,
			y: coordinates.y + Math.sin(angle) * distance
		};
	}
	private setPlayerContext(): void {
		this.contextRenderer.stroke(ColorName.WHITE);
		this.contextRenderer.fillColor(ColorName.RED, 100);
		this.contextRenderer.noStroke();
	}

	private renderWalls(): void {
		for (const [key, rects] of Object.entries(this.batches.wallBatches)) {
			this.unpackAndRender(key, rects);
		}
	}

	private renderGrid(): void {
		this.contextRenderer.fillColor(ColorName.BLUE, 50);
		this.batches.gridBatch.forEach(rectSpec => this.renderRect(rectSpec));
	}

	private unpackAndRender(
		key: string,
		rects: BatchedRect[],
	): void {
		const { color, intensity: brightnessValue } = this.batches.unpackKey(key);
		this.contextRenderer.fillColor(color, brightnessValue);
		this.renderRects(rects);
	}

	private renderRects(rects: BatchedRect[]): void {
		rects.forEach(rect => this.renderRect(rect));
	}

	private renderBackround(): void {
		this.contextRenderer.fillColor(ColorName.BLUE, 0.01);
		this.contextRenderer.rect({ x: 0, y: 0 }, Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
	}

	private renderRect(rectSpec: BatchedRect): void {
		this.contextRenderer.rect({ x: rectSpec.x, y: rectSpec.y }, rectSpec.width, rectSpec.height);
	}

	private batchRenderData(map: GameMapInterface
	): void {
		this.rays = this.raycaster.getViewRays(map.playerAngle);
		this.appendAllSlices(map);
	}

	private appendAllSlices(map: GameMapInterface): void {
		for (let i = 0; i < this.rays.length; i++) {
			this.appendSlice(i, map);
		}
	}

	private appendSlice(index: number, map: GameMapInterface): void {
		const angle = this.rays[index];
		this.appendWallSlice(angle, index, map);
		this.appendGridSlice(angle, index, map);
	}

	private appendWallSlice(
		angle: number,
		index: number,
		map: GameMapInterface
	): void {
		const { distance, color } = this.getAdjustedDistance(angle, map);
		const slice = this.sliceHeight(distance);
		const wallBrightness = this.brightness.calculateBrightness(distance);
		this.batches.addWallSlice(color, wallBrightness, { x: index, y: slice.origin }, slice.magnitude);
	}

	private appendGridSlice(
		angle: number,
		index: number,
		map: GameMapInterface
	): void {
		const { gridHits } = map.castRay(angle, Settings.MAX_DISTANCE);
		for (let j = 0; j < gridHits.length; j++) {
			this.appendGridPoint(gridHits[j], angle, index, map);
		}
	}

	private getAdjustedDistance(angle: number, map: GameMapInterface): { distance: number, color: ColorName } {
		const { distance, color } = map.castRay(angle, Settings.MAX_DISTANCE);
		const correctedDistance = this.raycaster.removeFishEye(distance, angle, map.playerAngle);
		return { distance: correctedDistance, color };
	}

	private sliceHeight(
		distance: number,
	): { origin: number, magnitude: number } {
		const wallTopOffset = Settings.WALL_HEIGHT - Settings.CAMERA_HEIGHT;
		const wallBottomOffset = -Settings.CAMERA_HEIGHT;
		const topY = this.horizonY - (wallTopOffset * this.raycaster.focalLength) / distance;
		const bottomY = this.horizonY - (wallBottomOffset * this.raycaster.focalLength) / distance;
		return { origin: topY, magnitude: bottomY - topY }
	}

	private appendGridPoint(
		gridHit: number,
		angle: number,
		index: number,
		map: GameMapInterface
	): void {
		const distance = this.raycaster.removeFishEye(gridHit, angle, map.playerAngle);
		const y = this.floorPoint(distance);
		this.batches.addGridPoint({ x: index, y });
	}

	private floorPoint(distance: number): number {
		const floorOffset = -Settings.CAMERA_HEIGHT;
		return this.horizonY - (floorOffset * this.raycaster.focalLength) / distance;
	}

}
