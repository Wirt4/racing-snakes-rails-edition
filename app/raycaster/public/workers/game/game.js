import { Settings } from '../settings/settings';
import { BatchCorrelator } from '../batchCorrelator/batchCorrelator';
class Game {
    constructor(map, batchRenderer, raycaster, brightness, player) {
        this.map = map;
        this.batchRenderer = batchRenderer;
        this.player = player;
        this.settings = new Settings();
        this.fieldOfVision = this.settings.FIELD_OF_VISION;
        this.batchCorrelator = new BatchCorrelator(map, raycaster, this.settings.MAX_DISTANCE, this.settings.HORIZON_Y, this.settings.CAMERA_HEIGHT, this.settings.WALL_HEIGHT, brightness, this.settings.RESOLUTION);
    }
    update() {
        this.player.move();
    }
    isGameOver() {
        return this.player.hasCollided(this.map.arena);
    }
    ;
    draw() {
        this.map.resetIntersections();
        this.batchCorrelator.batchRenderData();
        this.batchRenderer.batches = this.batchCorrelator.batches;
        if (this.isGameOver()) {
            this.batchRenderer.renderHUD();
        }
        else {
            this.batchRenderer.renderSlices();
        }
    }
}
export { Game };
