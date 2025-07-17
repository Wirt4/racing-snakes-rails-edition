import { Settings } from '../settings';
import { BatchRenderer, BatchCorrelator } from '../batchRenderer/batchRenderer';
import { ColorName } from '../color/color_name';
class Game {
    constructor(map, renderer, raycaster, brightness, displayHUD) {
        this.map = map;
        this.displayHUD = displayHUD;
        this.fieldOfVision = Settings.FIELD_OF_VISION;
        this.batchCorrelator = new BatchCorrelator(map, raycaster, Settings.MAX_DISTANCE, Settings.HORIZON_Y, Settings.CAMERA_HEIGHT, Settings.WALL_HEIGHT, brightness, Settings.RESOLUTION);
        this.batchRenderer = new BatchRenderer(renderer, Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT, ColorName.BLUE);
    }
    update() {
        this.map.movePlayer();
    }
    draw() {
        this.map.prepareFrame();
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
