import { SettingsInterface } from './interface';

export class Settings implements SettingsInterface {
	HORIZON_LINE_RATIO = 0.65
	FRAME_HEIGHT = -200
	MAX_BRIGHTNESS = 60
	CAMERA_ANGLE = 0 //60 degrees
	TURN_TIME = 30 //in frames
	PLAYER_TURN_DISTANCE = 2
	HUD_ON = true
	WALL_HEIGHT = 3
	PLAYER_SPEED = 0.25 //in units per frame
	CAMERA_HEIGHT = 2
	FRAMES_PER_SECOND = 60
	FIELD_OF_VISION = 5 * Math.PI / 12 //try wider angle for greater illusion of speed
	MAX_DISTANCE = 100
	MAX_PERCENT_BRIGHTNESS = 60
	MIN_PERCENT_BRIGHTNESS = 30
	FADE_DISTANCE = 2
	CANVAS_WIDTH = 400
	HORIZON_Y = 200
	GRID_CELL_SIZE = 2
	CANVAS_HEIGHT = 640
	RESOLUTION = 400 //TODO: fix game implementation so that display isn't squashed when this is smaller than CANVAS_WIDTH
}
