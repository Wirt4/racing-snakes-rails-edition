export class Settings {
    constructor() {
        this.HORIZON_LINE_RATIO = 0.65;
        this.FRAME_HEIGHT = -200;
        this.MAX_BRIGHTNESS = 60;
        this.CAMERA_ANGLE = 0;
        this.TURN_TIME = 12; //in frames
        this.HUD_ON = true;
        this.WALL_HEIGHT = 3;
        this.PLAYER_SPEED = 0.375; //in units per frame
        this.CAMERA_HEIGHT = 2;
        this.FRAMES_PER_SECOND = 60;
        this.FIELD_OF_VISION = Math.PI / 3; //try wider angle for greater illusion of speed
        this.MAX_DISTANCE = 100;
        this.MAX_PERCENT_BRIGHTNESS = 60;
        this.MIN_PERCENT_BRIGHTNESS = 10;
        this.FADE_DISTANCE = 2;
        this.CANVAS_WIDTH = 400;
        this.ARENA_WIDTH = 200;
        this.ARENA_HEIGHT = 200;
        this.HORIZON_Y = 200;
        this.GRID_CELL_SIZE = 4;
        this.CANVAS_HEIGHT = 640;
        this.RESOLUTION = 400;
    }
}
