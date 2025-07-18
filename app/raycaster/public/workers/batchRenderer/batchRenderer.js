import { Batches } from '../batches/batches';
class BatchRenderer {
    constructor(contextRenderer, canvasWidth, canvasHeight, gridColor) {
        this.contextRenderer = contextRenderer;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gridColor = gridColor;
        this._batches = new Batches();
    }
    set batches(batches: Batches) {
        this._batches = batches;
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
        //??
        for (const [key, rects] of this._batches.wallBatches.entries()) {
            this.unpackAndRender(key, rects); // key is now a structured object
        }
    }
    unpackAndRender(key, rects) {
        this.contextRenderer.fillColor(key.color, key.intensity);
        this.renderRects(rects);
    }
    renderGrid() {
        this.contextRenderer.fillColor(this.gridColor, 50);
        // use a preallocated array and a basic Knuth style stack with a pointer to track i
        // // use a preallocated array and a basic Knuth style stack with a pointer to track it
        if (this._batches.gridBatch.isEmpty) {
            return;
        }
        const path = new Path2D();
        while (!this._batches.gridBatch.isEmpty) {
            const rectSpec = this._batches.gridBatch.pop();
            path.rect(rectSpec.x, rectSpec.y, 1, 1);
        }
        this.contextRenderer.fillColor(this.gridColor, 50);
        this.contextRenderer.fillPath(path);
    }
    renderRects(rects) {
        const path = new Path2D();
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            path.rect(rect.x, rect.y, rect.width, rect.height);
            this._batches.releaseSlice(rect);
        }
        this.contextRenderer.fillPath(path);
    }
    renderHUDMap() {
        for (const [key, rects] of this._batches.mapBatches.entries()) {
            this.renderHUDLines(key, rects);
        }
    }
    renderHUDLines(key, lines) {
        const { color, intensity: weight } = key;
        this.contextRenderer.stroke(color);
        this.contextRenderer.strokeWeight(weight);
        lines.forEach(line => this.contextRenderer.line(line));
    }
}
export { BatchRenderer };
