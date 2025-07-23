import { ContextRendererInterface } from '../renderer/interface';
import { ColorName } from '../color/color_name';
import { Batches, BatchedRect } from '../batches/batches';
import { LineSegment } from '../geometry/interfaces';
import { ColorKey } from '../color_key/color_key_cache';
import { BatchRendererInterface } from './interface';

class BatchRenderer implements BatchRendererInterface {
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
	public clear() {
		this.contextRenderer.reset();
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
		for (const [key, rects] of this._batches.wallBatches.entries()) {
			this.unpackAndRender(key, rects);
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
		if (this._batches.gridBatch.isEmpty) {
			return;
		}
		this.contextRenderer.fillColor(this.gridColor, 50);
		this.contextRenderer.fillPath(this.populatePath());
	}

	private populatePath(): Path2D {
		const pixSize = 1
		const path = new Path2D();
		this.fillPathWithPoints(path, pixSize);
		return path;
	}

	private fillPathWithPoints(path: Path2D, pixSize: number): void {
		while (!this._batches.gridBatch.isEmpty) {
			const x = this._batches.gridBatch.top.x;
			const y = this._batches.gridBatch.top.y;
			this._batches.gridBatch.freetop();
			path.rect(x, y, pixSize, pixSize);
		}
	}

	private renderRects(rects: BatchedRect[]): void {
		const path = new Path2D();
		this.fillPathWithRects(path, rects);
		this.contextRenderer.fillPath(path);
	}

	private fillPathWithRects(path: Path2D, rects: BatchedRect[]): void {
		for (let i = 0; i < rects.length; i++) {
			const rect = rects[i];
			path.rect(rect.x, rect.y, rect.width, rect.height);
			this._batches.releaseSlice(rect);
		}
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
		const { color } = key;
		this.contextRenderer.stroke(color);
		this.contextRenderer.strokeWeight(1);
		this.drawLines(lines);
	}

	private drawLines(lines: LineSegment[]): void {
		for (let i = 0; i < lines.length; i++) {
			this.contextRenderer.line(lines[i]);
		}
	}
}


export { BatchRenderer };
