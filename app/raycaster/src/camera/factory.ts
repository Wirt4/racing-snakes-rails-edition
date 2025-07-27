import { Camera } from './camera';
import { CameraSettings } from './settings';
import { CameraInterface } from './interface'

export function cameraFactory(settings: CameraSettings): CameraInterface {
	return new Camera(settings.TURN_TIME, settings.CAMERA_ANGLE);
}
