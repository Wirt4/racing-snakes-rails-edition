import { SettingsInterface } from './interface';
import { ColorName } from '../color/color_name';
import { CameraSettings } from '../camera/settings';
import { BatchRendererSettings } from '../batchRenderer/settings';
import { PlayerSettings } from '../player/settings';
import { RaycasterSettings } from '../raycaster/settings';

export class Settings implements
	BatchRendererSettings,
	CameraSettings,
	PlayerSettings,
	RaycasterSettings {
	RAYCASTER_HORIZON_LINE_RATIO = 0.65
	PLAYER_START_X = 10
	PLAYER_START_Y = 10
	CANVAS_ID = 'game-window'
	HTML_ELEMENT_ID = 'app'
	FRAME_HEIGHT = -200
	MAX_BRIGHTNESS = 60
	PLAYER_COLOR = ColorName.GREEN
	MAP_COLOR = ColorName.BLACK
	CAMERA_ANGLE = 0
	TURN_TIME = 12//in frames
	HUD_ON = true
	WALL_HEIGHT = 3
	PLAYER_SPEED = 0.375 //in units per frame
	CAMERA_HEIGHT = 2
	FRAMES_PER_SECOND = 60
	RAYCASTER_FIELD_OF_VISION = 5 * Math.PI / 12 //try wider angle for greater illusion of speed
	MAX_DISTANCE = 100
	RAYCASTER_MAX_DISTANCE = 100
	MAX_PERCENT_BRIGHTNESS = 60
	MIN_PERCENT_BRIGHTNESS = 10
	FADE_DISTANCE = 2
	CANVAS_WIDTH = 400
	ARENA_WIDTH = 200
	ARENA_HEIGHT = 200
	GRID_COLOR = ColorName.BLUE
	HORIZON_Y = 200
	GRID_CELL_SIZE = 4
	CANVAS_HEIGHT = 640
	RAYCASTER_RESOLUTION = 400 //TODO: fix game implementation so that display isn't squashed when this is smaller than CANVAS_WIDTH
}
