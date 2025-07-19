export interface SettingsInterface {
	HORIZON_LINE_RATIO: number;
	FRAME_HEIGHT: number;
	MAX_BRIGHTNESS: number;
	CAMERA_ANGLE: number; // in radians
	TURN_TIME: number; // in frames
	HUD_ON: boolean;
	WALL_HEIGHT: number;
	PLAYER_SPEED: number;
	CAMERA_HEIGHT: number;
	FRAMES_PER_SECOND: number;
	FIELD_OF_VISION: number; // in radians
	MAX_DISTANCE: number;
	MAX_PERCENT_BRIGHTNESS: number;
	MIN_PERCENT_BRIGHTNESS: number;
	FADE_DISTANCE: number;
	CANVAS_WIDTH: number;
	HORIZON_Y: number;
	GRID_CELL_SIZE: number;
	CANVAS_HEIGHT: number;
	RESOLUTION: number; // TODO: fix game implementation so that display isn't squashed when this is smaller than CANVAS_WIDTH
}
