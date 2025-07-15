import { RendererInterface } from '../renderer/renderer';
import { GameMapInterface } from '../gamemap/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings';
import { ColorName } from './color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { BrightnessInterface } from '../brightness/interface';
import { Batches, BatchedRect } from './batches'

class Game {
	fieldOfVision: number = Settings.FIELD_OF_VISION;
	private rays: Float32Array;
	private static readonly HORIZON_Y = Settings.HORIZON_LINE_RATIO * Settings.CANVAS_HEIGHT;

	constructor(public map: GameMapInterface, private renderer: RendererInterface) {
		this.rays = new Float32Array(Settings.CANVAS_WIDTH);
	}

	update(): void {
		this.map.movePlayer();
	}

	draw(
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface,
		HUD: Boolean = false
	): void {
		this.renderBackround();
		const displaySpecBatches = this.batchRenderData(raycaster, brightness);
		this.renderFrame(displaySpecBatches);
		this.drawHUD(HUD);
	}

	private renderFrame(batches: Batches): void {
		this.renderWalls(batches)
		this.drawGrid(batches);
	}

	private drawGrid(batches: Batches): void {
		this.renderer.fillColor(ColorName.BLUE, 50);
		batches.gridBatch.forEach(rectSpec => this.renderRect(rectSpec));
	}

	private renderRect(rectSpec: BatchedRect): void {
		this.renderer.rect({ x: rectSpec.x, y: rectSpec.y }, rectSpec.width, rectSpec.height);
	}

	private drawHUD(visibleHUD: Boolean): void {
		if (!visibleHUD) {
			return;
		}
		const batches = this.getHUDBatches();
		this.renderHUD(batches);
	}

	private renderHUD(batches: Batches): void {
		this.renderer.save();
		this.renderHUDMap(batches);
		this.renderPlayer();
		this.renderer.restore()
	}

	private renderHUDMap(batches: Batches): void {
		for (const [key, lines] of Object.entries(batches.mapBatches)) {
			this.renderHUDLines(batches, this.renderer, key, lines);
		}
	}

	private renderHUDLines(
		batches: Batches,
		renderer: RendererInterface,
		key: string,
		lines: LineSegment[]
	): void {
		const { color, intensity: weight } = batches.unpackKey(key)
		renderer.stroke(color);
		renderer.strokeWeight(weight);
		lines.forEach(line => renderer.line(line));
	}

	private renderPlayer(): void {
		this.setPlayerContext();
		this.renderer.ellipse(this.map.playerPosition, 0.2);
		this.draw2DRays();
	}

	private setPlayerContext(): void {
		this.renderer.stroke(ColorName.WHITE);
		this.renderer.fillColor(ColorName.RED, 100);
		this.renderer.noStroke();
	}

	private getHUDBatches(): Batches {
		const batches = new Batches();
		batches.addMapWalls(this.map.walls);
		batches.addMapWalls(this.map.playerTrail);
		return batches;
	}

	private batchRenderData(
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface
	): Batches {
		this.rays = raycaster.getViewRays(this.map.playerAngle);
		let batches = new Batches();
		batches = this.appendAllSlices(batches, raycaster, brightness);
		return batches;
	}

	private appendAllSlices(
		batches: Batches,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface
	): Batches {
		for (let i = 0; i < Settings.CANVAS_WIDTH; i++) {
			batches = this.appendSlice(batches, i, raycaster, brightness);
		}
		return batches;
	}

	private appendSlice(
		batches: Batches,
		index: number,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface
	): Batches {
		const angle = this.rays[index];
		batches = this.appendWallSlice(batches, angle, index, raycaster, brightness);
		batches = this.appendGridSlice(batches, angle, index, raycaster);
		return batches;
	}

	private appendWallSlice(
		batches: Batches,
		angle: number,
		index: number,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface
	): Batches {
		const { distance, color } = this.getAdjustedDistance(angle, raycaster);
		const slice = this.sliceHeight(distance, raycaster.focalLength);
		const wallBrightness = brightness.calculateBrightness(distance);
		batches.addWallSlice(color, wallBrightness, { x: index, y: slice.origin }, slice.magnitude);
		return batches;
	}

	private getAdjustedDistance(angle: number, raycaster: RaycasterInterface): { distance: number, color: ColorName } {
		const { distance, color } = this.map.castRay(angle, Settings.MAX_DISTANCE);
		const correctedDistance = raycaster.removeFishEye(distance, angle, this.map.playerAngle);
		return { distance: correctedDistance, color };
	}

	private appendGridSlice(
		batches: Batches,
		angle: number,
		index: number,
		raycaster: RaycasterInterface
	): Batches {
		const { gridHits } = this.map.castRay(angle, Settings.MAX_DISTANCE);
		for (let j = 0; j < gridHits.length; j++) {
			batches = this.appendGridPoint(batches, gridHits[j], angle, index, raycaster);
		}
		return batches;
	}

	private appendGridPoint(
		batches: Batches,
		gridHit: number,
		angle: number,
		index: number,
		raycaster: RaycasterInterface
	): Batches {
		const distance = raycaster.removeFishEye(gridHit, angle, this.map.playerAngle);
		const y = this.floorPoint(distance, raycaster.focalLength);
		batches.addGridPoint({ x: index, y });
		return batches;
	}

	private renderWalls(batches: Batches): void {
		for (const [key, rects] of Object.entries(batches.wallBatches)) {
			this.unpackAndRender(batches, rects, key);
		}
	}

	private unpackAndRender(
		batches: Batches,
		rects: BatchedRect[],
		key: string,
	): void {
		const { color, intensity: brightnessValue } = batches.unpackKey(key);
		this.renderer.fillColor(color, brightnessValue);
		this.renderRects(rects);
	}

	private renderRects(rects: BatchedRect[]): void {
		rects.forEach(rect => this.renderRect(rect));
	}

	private sliceHeight(
		distance: number,
		focalLength: number
	): { origin: number, magnitude: number } {
		const wallTopOffset = Settings.WALL_HEIGHT - Settings.CAMERA_HEIGHT;
		const wallBottomOffset = -Settings.CAMERA_HEIGHT;
		const topY = Game.HORIZON_Y - (wallTopOffset * focalLength) / distance;
		const bottomY = Game.HORIZON_Y - (wallBottomOffset * focalLength) / distance;
		return { origin: topY, magnitude: bottomY - topY }
	}

	private floorPoint(distance: number, focalLength: number): number {
		const floorOffset = -Settings.CAMERA_HEIGHT;
		return Game.HORIZON_Y - (floorOffset * focalLength) / distance;
	}

	private draw2DRays(): void {
		this.renderer.stroke(ColorName.GREEN);
		this.renderer.strokeWeight(0.05);
		for (let index = 0; index < Settings.CANVAS_WIDTH; index++) {
			const angle = this.rays[index];
			const { distance } = this.map.castRay(angle, Settings.MAX_DISTANCE);
			const hit = this.pointOnTrajectory(this.map.playerPosition, angle, distance);
			this.renderer.line({ start: this.map.playerPosition, end: hit });
		}
	}

	private renderBackround(): void {
		this.renderer.fillColor(ColorName.BLUE, 0.01);
		this.renderer.rect({ x: 0, y: 0 }, Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
	}

	private pointOnTrajectory(coordinates: Coordinates, angle: number, distance: number): Coordinates {
		return {
			x: coordinates.x + Math.cos(angle) * distance,
			y: coordinates.y + Math.sin(angle) * distance
		};
	}
}
export { Game };
