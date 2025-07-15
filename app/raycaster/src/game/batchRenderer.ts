import { ContextRendererInterface } from '../renderer/interface';
import { ColorName } from './color/color_name';
import { Settings } from '../settings';

export class BatchRenderer {

	constructor(private contextRenderer: ContextRendererInterface) {
	}
	public batchSlices(): void { }
	public renderSlices(): void {
		this.renderBackround();
	}
	private renderBackround(): void {
		this.contextRenderer.fillColor(ColorName.BLUE, 0.01);
		this.contextRenderer.rect({ x: 0, y: 0 }, Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
	}
}
