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
	map: GameMapInterface;
	private rays: Float32Array;
	private static readonly HORIZON_Y = Settings.HORIZON_LINE_RATIO * Settings.CANVAS_HEIGHT;

	constructor(map: GameMapInterface) {
		this.map = map;
		this.rays = new Float32Array(Settings.CANVAS_WIDTH);
	}

	update(): void {
		this.map.movePlayer();
	}

	draw(
		renderer: RendererInterface,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface,
		HUD: Boolean = false
	): void {
		this.renderBackround(renderer);
		const displaySpecbatches = this.batchRenderData(raycaster, brightness);
		this.renderFrame(displaySpecbatches, renderer);
		this.drawHUD(renderer, HUD);
	}

	private renderFrame(batches: Batches, renderer: RendererInterface): void {
		this.renderWalls(batches, renderer)
		this.drawGrid(batches, renderer);
	}

	private drawGrid(batches: Batches, renderer: RendererInterface): void {
		renderer.fillColor(ColorName.BLUE, 50);
		batches.gridBatch.forEach(rectSpec => this.renderRect(rectSpec, renderer));
	}

	private renderRect(rectSpec: BatchedRect, renderer: RendererInterface): void {
		renderer.rect({ x: rectSpec.x, y: rectSpec.y }, rectSpec.width, rectSpec.height);
	}

	private drawHUD(renderer: RendererInterface, visibleHUD: Boolean): void {
		if (!visibleHUD) {
			return;
		}
		const batches = this.getHUDBatches();
		this.renderHUD(batches, renderer);
	}

	private renderHUD(batches: Batches, renderer: RendererInterface): void {
		renderer.save();
		this.renderHUDMap(batches, renderer);
		this.renderPlayer(renderer);
		renderer.restore()
	}

	private renderHUDMap(batches: Batches, renderer: RendererInterface): void {
		for (const [key, lines] of Object.entries(batches.mapBatches)) {
			this.renderHUDLines(batches, renderer, key, lines);
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

	private renderPlayer(renderer: RendererInterface): void {
		this.setPlayerContext(renderer);
		renderer.ellipse(this.map.playerPosition, 0.2);
		this.draw2DRays(renderer);
	}

	private setPlayerContext(renderer: RendererInterface): void {
		renderer.stroke(ColorName.WHITE);
		renderer.fillColor(ColorName.RED, 100);
		renderer.noStroke();
	}

	private getHUDBatches(): Batches {
		const batches = new Batches();
		batches.addMapWalls(this.map.walls);
		batches.addMapWalls(this.map.playerTrail);
		return batches;
	}

	private batchRenderData(
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface): Batches {
		this.rays = raycaster.getViewRays(this.map.playerAngle);
		const batches = new Batches();
		for (let i = 0; i < Settings.CANVAS_WIDTH; i++) {
			const angle = this.rays[i];
			const { distance, color, gridHits } = this.map.castRay(angle, Settings.MAX_DISTANCE);
			const correctedDistance = raycaster.removeFishEye(distance, angle, this.map.playerAngle);
			const slice = this.sliceHeight(correctedDistance, raycaster.focalLength);
			const wallBrightness = brightness.calculateBrightness(correctedDistance);
			batches.addWallSlice(color, wallBrightness, { x: i, y: slice.origin }, slice.magnitude);

			for (let j = 0; j < gridHits.length; j++) {
				const hit = gridHits[j];
				const correctedGridDistance = raycaster.removeFishEye(hit, angle, this.map.playerAngle);
				const y = this.floorPoint(correctedGridDistance, raycaster.focalLength);
				batches.addGridPoint({ x: i, y });
			}
		}
		return batches;
	}

	private renderWalls(batches: Batches, renderer: RendererInterface): void {
		for (const [key, rects] of Object.entries(batches.wallBatches)) {
			const { color, intensity: brightnessValue } = batches.unpackKey(key);
			renderer.fillColor(color, brightnessValue);
			rects.forEach(r => {
				renderer.rect({ x: r.x, y: r.y }, r.width, r.height)
			});
		}
	}

	private sliceHeight(distance: number, focalLength: number): { origin: number, magnitude: number } {
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

	private draw2DRays(renderer: RendererInterface): void {
		renderer.stroke(ColorName.GREEN);
		renderer.strokeWeight(0.05);
		for (let index = 0; index < Settings.CANVAS_WIDTH; index++) {
			const angle = this.rays[index];
			const { distance } = this.map.castRay(angle, Settings.MAX_DISTANCE);
			const hit = this.pointOnTrajectory(this.map.playerPosition, angle, distance);
			renderer.line({ start: this.map.playerPosition, end: hit });
		}
	}

	private renderBackround(renderer: RendererInterface): void {
		renderer.fillColor(ColorName.BLUE, 0.01);
		renderer.rect({ x: 0, y: 0 }, Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
	}

	private pointOnTrajectory(coordinates: Coordinates, angle: number, distance: number): Coordinates {
		return {
			x: coordinates.x + Math.cos(angle) * distance,
			y: coordinates.y + Math.sin(angle) * distance
		};
	}
}
export { Game };
