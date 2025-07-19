import { ContextRendererInterface } from '../renderer/interface';
import { GameMapInterface } from '../gamemap/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings/settings';
import { BrightnessInterface } from '../brightness/interface';
import { BatchRenderer } from '../batchRenderer/batchRenderer';
import { BatchCorrelator } from '../batchCorrelator/batchCorrelator';
import { ColorName } from '../color/color_name';
import { PlayerInterface } from '../player/interface';

class Game {
	private settings: Settings = new Settings();
	fieldOfVision: number = this.settings.FIELD_OF_VISION;
	private batchRenderer: BatchRenderer;
	private batchCorrelator: BatchCorrelator;

	constructor(
		public map: GameMapInterface,
		renderer: ContextRendererInterface,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface,
		private readonly displayHUD: Boolean,
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
		this.batchRenderer = new BatchRenderer(
			renderer,
			this.settings.CANVAS_WIDTH,
			this.settings.CANVAS_HEIGHT,
			ColorName.BLUE
		);
	}

	update(): void {
		this.player.move();
	}

	draw(
	): void {
		this.map.resetIntersections()
		this.batchCorrelator.batchRenderData();
		this.batchRenderer.batches = this.batchCorrelator.batches;
		this.batchRenderer.renderSlices();
		//TODO: (on separate branch) - try buffer swapping if that may speed up rendering
		if (this.displayHUD) {
			this.batchRenderer.renderHUD();
		}
	}
}
export { Game };
