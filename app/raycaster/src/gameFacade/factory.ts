import { GameFacadeInterface } from './interface';
import { GameFacade } from './gameFacade';
import { Settings } from '../settings/settings';
import { batchRendererFactory } from '../batchRenderer/factory';
import { BatchRendererInterface } from '../batchRenderer/interface';
import { Game } from '../game/game';
import { GameMap } from '../gamemap/map';
import { Raycaster } from '../raycaster/raycaster';
import { Brightness } from '../brightness/brightness';
import { Player } from '../player/player';
import { cameraFactory } from '../camera/factory';

export function GameFacadeFactory(
	settings: Settings, canvas: OffscreenCanvas
): GameFacadeInterface {
	const batchRenderer = batchRendererFactory(settings, canvas);
	const player = createPlayer(settings);
	const game = createGame(settings, batchRenderer, player);
	return new GameFacade(game, player, batchRenderer);
}

function createRaycaster(settings: Settings): Raycaster {
	return new Raycaster(
		settings.RESOLUTION,
		settings.FIELD_OF_VISION,
		settings.CANVAS_WIDTH,
		settings.CANVAS_HEIGHT,
		settings.MAX_DISTANCE,
		settings.HORIZON_LINE_RATIO * settings.CANVAS_HEIGHT,
		settings.WALL_HEIGHT,
		settings.CAMERA_HEIGHT
	);
}

function createGame(
	settings: Settings,
	batchRenderer: BatchRendererInterface,
	player: Player
): Game {
	const mapSize = { width: settings.ARENA_WIDTH, height: settings.ARENA_HEIGHT };
	const map = new GameMap(mapSize, settings.MAP_COLOR, settings.GRID_CELL_SIZE, player);
	const raycaster = createRaycaster(settings);
	const brightness = new Brightness(settings.MAX_DISTANCE, settings.MAX_BRIGHTNESS);
	return new Game(map, batchRenderer, raycaster, brightness, player);
}

function createPlayer(settings: Settings): Player {
	const camera = cameraFactory(settings);
	return new Player(
		{ x: 10, y: 10 },
		settings.PLAYER_SPEED,
		settings.PLAYER_COLOR,
		camera
	);
}
