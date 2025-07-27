import { GameFacadeInterface } from './interface';
import { GameFacade } from './gameFacade';
import { Settings } from '../settings/settings';
import { batchRendererFactory } from '../batchRenderer/factory';
import { BatchRendererInterface } from '../batchRenderer/interface';
import { Game } from '../game/game';
import { GameMap } from '../gamemap/map';
import { Brightness } from '../brightness/brightness';
import { cameraFactory } from '../camera/factory';
import { playerFactory } from '../player/factory';
import { PlayerInterface } from '../player/interface';
import { raycasterFactory } from '../raycaster/factory';
import { BatchCorrelator } from '../batchCorrelator/batchCorrelator';
export function GameFacadeFactory(
	settings: Settings, canvas: OffscreenCanvas
): GameFacadeInterface {
	const batchRenderer = batchRendererFactory(settings, canvas);
	const player = playerFactory(settings, cameraFactory(settings));
	const game = createGame(settings, batchRenderer, player);
	return new GameFacade(game, player, batchRenderer);
}

function createGame(
	settings: Settings,
	batchRenderer: BatchRendererInterface,
	player: PlayerInterface
): Game {
	const mapSize = { width: settings.ARENA_WIDTH, height: settings.ARENA_HEIGHT };
	const map = new GameMap(mapSize, settings.MAP_COLOR, settings.GRID_CELL_SIZE, player);
	const raycaster = raycasterFactory(settings);
	const brightness = new Brightness(settings.MAX_DISTANCE, settings.MAX_BRIGHTNESS);
	const batchCorrealtor = new BatchCorrelator(map, raycaster, settings.MAX_DISTANCE, settings.HORIZON_Y, settings.CAMERA_HEIGHT, settings.WALL_HEIGHT, brightness, settings.RAYCASTER_RESOLUTION);
	return new Game(map, batchRenderer, player, batchCorrealtor);
}
