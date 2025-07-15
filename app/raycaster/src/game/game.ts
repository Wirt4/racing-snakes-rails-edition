import { ContextRendererInterface } from '../renderer/interface';
import { GameMapInterface } from '../gamemap/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings';
import { BrightnessInterface } from '../brightness/interface';
import { BatchRenderer } from './batchRenderer';

class Game {
	fieldOfVision: number = Settings.FIELD_OF_VISION;
	private batchRenderer: BatchRenderer;

	constructor(
		public map: GameMapInterface,
		renderer: ContextRendererInterface,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface,
		private readonly displayHUD: Boolean
	) {
		this.batchRenderer = new BatchRenderer(
			renderer,
			raycaster,
			brightness,
			Settings.HORIZON_LINE_RATIO * Settings.CANVAS_HEIGHT,
			Settings.CANVAS_WIDTH
		);
	}

	update(): void {
		this.map.movePlayer();
	}

	draw(
	): void {
		this.batchRenderer.batchSlices(this.map);
		if (this.displayHUD) {
			this.batchRenderer.batchHUD(this.map);
		}
		this.batchRenderer.renderSlices();
		if (this.displayHUD) {
			this.batchRenderer.renderHUD(this.map);
		}
	}
}
export { Game };
