import { ContextRendererInterface } from '../renderer/interface';
import { GameMapInterface } from '../gamemap/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings/settings';
import { BrightnessInterface } from '../brightness/interface';
import { BatchRendererInterface } from '../batchRenderer/interface';
import { BatchCorrelator } from '../batchCorrelator/batchCorrelator';
import { PlayerInterface } from '../player/interface';

class Game {
	private settings: Settings = new Settings();
	fieldOfVision: number = this.settings.FIELD_OF_VISION;
	private batchCorrelator: BatchCorrelator;

	constructor(
		public map: GameMapInterface,
		private batchRenderer: BatchRendererInterface,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface,
		private player: PlayerInterface,
	) {
		this.batchCorrelator = new BatchCorrelator(
			map,
			raycaster,
			this.settings.MAX_DISTANCE,
			this.settings.HORIZON_Y,
			this.settings.CAMERA_HEIGHT,
			this.settings.WALL_HEIGHT,
			brightness,
			this.settings.RESOLUTION
		)
	}

	update(): void {
		this.player.move();
		//check for if game is over
	}

	isGameOver(): boolean {
		return this.map.hasCollidedWithWall(this.player);
		//return true;
	};

	draw(
	): void {
		this.map.resetIntersections()
		this.batchCorrelator.batchRenderData();
		this.batchRenderer.batches = this.batchCorrelator.batches;
		if (this.map.hasCollidedWithWall(this.player)) {
			this.batchRenderer.renderHUD();
		}
	}
}
export { Game };
