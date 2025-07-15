import { ContextRendererInterface } from '../renderer/interface';
import { GameMapInterface } from '../gamemap/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings';
import { BrightnessInterface } from '../brightness/interface';
import { Temp, BatchCorrelator } from './batchRenderer';
import { ColorName } from './color/color_name';

class Game {
	fieldOfVision: number = Settings.FIELD_OF_VISION;
	private batchRenderer: Temp;
	private batchCorrelator: BatchCorrelator;

	constructor(
		public map: GameMapInterface,
		renderer: ContextRendererInterface,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface,
		private readonly displayHUD: Boolean
	) {
		this.batchRenderer = new Temp(
			renderer,
			Settings.CANVAS_WIDTH,
			Settings.CANVAS_HEIGHT,
			ColorName.BLUE
		);
		this.batchCorrelator = new BatchCorrelator(
			raycaster,
			Settings.MAX_DISTANCE,
			Settings.HORIZON_Y,
			Settings.CAMERA_HEIGHT,
			Settings.WALL_HEIGHT,
			brightness,
			Settings.RESOLUTION
		)
	}

	update(): void {
		this.map.movePlayer();
	}

	draw(
	): void {
		this.batchCorrelator.setGameMap(this.map);
		this.batchCorrelator.batchRenderData();
		this.batchRenderer.batches = this.batchCorrelator.batches;
		this.batchRenderer.renderSlices();

		if (this.displayHUD) {
			this.batchRenderer.renderHUD();
		}
	}
}
export { Game };
