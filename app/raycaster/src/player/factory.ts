import { PlayerSettings } from './settings';
import { Player } from '../player/player';
import { PlayerInterface } from '../player/interface';
import { CameraInterface } from '../camera/interface';
export function playerFactory(settings: PlayerSettings, camera: CameraInterface): PlayerInterface {
	return new Player(
		{
			x: settings.PLAYER_START_X,
			y: settings.PLAYER_START_Y
		},
		settings.PLAYER_SPEED,
		settings.PLAYER_COLOR,
		camera);
}
