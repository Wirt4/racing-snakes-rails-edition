import { Batches } from '../batches/batches';
class BatchRenderer {
    constructor(contextRenderer, canvasWidth, canvasHeight, gridColor) {
        this.contextRenderer = contextRenderer;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gridColor = gridColor;
        this._batches = new Batches();
    }
    set batches(batches) {
        this._batches = batches;
    }
    clear() {
        this.contextRenderer.reset();
    }
    renderSlices() {
        this.renderBackground();
        this.renderWalls();
        this.renderGrid();
    }
    renderHUD() {
        this.contextRenderer.save();
        this.renderHUDMap();
        this.contextRenderer.restore();
    }
    renderBackground() {
        this.contextRenderer.fillColor(this.gridColor, 0);
        this.contextRenderer.rect({ x: 0, y: 0 }, this.canvasWidth, this.canvasHeight);
    }
    renderWalls() {
        for (const [key, rects] of this._batches.wallBatches.entries()) {
            this.unpackAndRender(key, rects);
        }
    }
    unpackAndRender(key, rects) {
        this.contextRenderer.fillColor(key.color, key.intensity);
        this.renderRects(rects);
    }
    renderGrid() {
        if (this._batches.gridBatch.isEmpty) {
            return;
        }
        this.contextRenderer.fillColor(this.gridColor, 50);
        this.contextRenderer.fillPath(this.populatePath());
    }
    populatePath() {
        const pixSize = 1;
        const path = new Path2D();
        this.fillPathWithPoints(path, pixSize);
        return path;
    }
    fillPathWithPoints(path, pixSize) {
        while (!this._batches.gridBatch.isEmpty) {
            const x = this._batches.gridBatch.top.x;
            const y = this._batches.gridBatch.top.y;
            this._batches.gridBatch.freetop();
            path.rect(x, y, pixSize, pixSize);
        }
    }
    renderRects(rects) {
        const path = new Path2D();
        this.fillPathWithRects(path, rects);
        this.contextRenderer.fillPath(path);
    }
    fillPathWithRects(path, rects) {
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            path.rect(rect.x, rect.y, rect.width, rect.height);
            this._batches.releaseSlice(rect);
        }
    }
    renderHUDMap() {
        for (const [key, rects] of this._batches.mapBatches.entries()) {
            this.renderHUDLines(key, rects);
        }
    }
    renderHUDLines(key, lines) {
        const { color } = key;
        this.contextRenderer.stroke(color);
        this.contextRenderer.strokeWeight(1);
        this.drawLines(lines);
    }
    drawLines(lines) {
        for (let i = 0; i < lines.length; i++) {
            this.contextRenderer.line(lines[i]);
        }
    }
}
export { BatchRenderer };
