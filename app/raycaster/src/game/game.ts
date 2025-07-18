import { ContextRendererInterface } from '../renderer/interface';
import { GameMapInterface } from '../gamemap/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings';
import { BrightnessInterface } from '../brightness/interface';
import { BatchRenderer } from '../batchRenderer/batchRenderer';
import { BatchCorrelator } from '../batchCorrelator/batchCorrelator';
import { ColorName } from '../color/color_name';

class Game {
	fieldOfVision: number = Settings.FIELD_OF_VISION;
	private batchRenderer: BatchRenderer;
	private batchCorrelator: BatchCorrelator;

	constructor(
		public map: GameMapInterface,
		renderer: ContextRendererInterface,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface,
		private readonly displayHUD: Boolean
	) {
		this.batchCorrelator = new BatchCorrelator(
			map,
			raycaster,
			Settings.MAX_DISTANCE,
			Settings.HORIZON_Y,
			Settings.CAMERA_HEIGHT,
			Settings.WALL_HEIGHT,
			brightness,
			Settings.RESOLUTION
		)
		this.batchRenderer = new BatchRenderer(
			renderer,
			Settings.CANVAS_WIDTH,
			Settings.CANVAS_HEIGHT,
			ColorName.BLUE
		);

	}

	update(): void {
		this.map.movePlayer();
	}

	draw(
	): void {
		this.map.prepareFrame()
		this.batchCorrelator.batchRenderData();
		this.batchRenderer.batches = this.batchCorrelator.batches;
		this.batchRenderer.renderSlices();

		if (this.displayHUD) {
			this.batchRenderer.renderHUD();
		}
		//logColorKeyCacheStats();//for debugging
	}
}
export { Game };
