import { ContextRendererInterface } from '../renderer/interface';
import { ColorName } from '../color/color_name';
import { Batches, BatchedRect } from '../batches/batches';
import { LineSegment } from '../geometry/interfaces';
import { ColorKey } from './color_key_cache';

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
		//??
		for (const [key, rects] of this._batches.wallBatches.entries()) {
			this.unpackAndRender(key, rects); // key is now a structured object
		}
	}

	private unpackAndRender(
		key: ColorKey,
		rects: BatchedRect[],
	): void {
		this.contextRenderer.fillColor(key.color, key.intensity);
		this.renderRects(rects);
	}

	private renderGrid(): void {
		if (this._batches.gridBatch.isEmpty) return;
		const path = new Path2D();
		while (!this._batches.gridBatch.isEmpty) {
			const rectSpec = this._batches.gridBatch.top;
			path.rect(rectSpec.x, rectSpec.y, 1, 1);
			this._batches.gridBatch.freetop();
		}
		this.contextRenderer.fillColor(this.gridColor, 50);
		this.contextRenderer.fillPath(path);
	}

	private renderRects(rects: BatchedRect[]): void {
		const path = new Path2D();
		for (const { x, y, width, height } of rects) {
			path.rect(x, y, width, height);
		}
		this.contextRenderer.fillPath(path);
	}

	private renderHUDMap(): void {
		for (const [key, rects] of this._batches.mapBatches.entries()) {
			this.renderHUDLines(key, rects);
		}
	}

	private renderHUDLines(
		key: ColorKey,
		lines: LineSegment[]
	): void {
		const { color, intensity: weight } = key;
		if (color === ColorName.NONE) return;
		this.contextRenderer.stroke(color);
		this.contextRenderer.strokeWeight(weight);
		lines.forEach(line => this.contextRenderer.line(line));
	}
}
export { BatchRenderer };
