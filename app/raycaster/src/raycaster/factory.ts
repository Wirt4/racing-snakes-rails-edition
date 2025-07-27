import { RaycasterInterface } from './interface'
import { RaycasterSettings } from './settings'
import { Raycaster } from './raycaster'

export function raycasterFactory(settings: RaycasterSettings): RaycasterInterface {
	return new Raycaster(
		settings.RAYCASTER_RESOLUTION,
		settings.RAYCASTER_FIELD_OF_VISION,
		settings.CANVAS_WIDTH,
		settings.CANVAS_HEIGHT,
		settings.RAYCASTER_MAX_DISTANCE,
		settings.RAYCASTER_HORIZON_LINE_RATIO * settings.CANVAS_HEIGHT,
		settings.WALL_HEIGHT,
		settings.CAMERA_HEIGHT
	);
}
