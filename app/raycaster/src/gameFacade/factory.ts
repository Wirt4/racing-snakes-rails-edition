import { GameFacadeInterface } from './interface';
import { GameFacade } from './gameFacade';
import { SettingsInterface } from '../settings/interface';
import { BatchRenderer } from '../batchRenderer/batchRenderer';
import { Renderer } from '../renderer/renderer';
import { Game } from '../game/game';
import { GameMap } from '../gamemap/map';
import { Raycaster } from '../raycaster/raycaster';
import { Brightness } from '../brightness/brightness';
import { Player } from '../player/player';
import { Camera } from '../camera/camera';
import { ColorName } from '../color/color_name';

export function GameFacadeFactory(settings: SettingsInterface, canvas: OffscreenCanvas): GameFacadeInterface {
	const batchRenderer = createBatchRenderer(settings, canvas);
	const mapSize = { width: settings.ARENA_WIDTH, height: settings.ARENA_HEIGHT };
	const camera = new Camera(settings.TURN_TIME, settings.CAMERA_ANGLE);
	const player = new Player({ x: 10, y: 10 }, settings.PLAYER_SPEED, settings.PLAYER_COLOR, camera);
	const map = new GameMap(mapSize, settings.MAP_COLOR, settings.GRID_CELL_SIZE, player);

	const raycaster = new Raycaster(
		settings.RESOLUTION,
		settings.FIELD_OF_VISION,
		settings.CANVAS_WIDTH,
		settings.CANVAS_HEIGHT,
		settings.MAX_DISTANCE,
		settings.HORIZON_LINE_RATIO * settings.CANVAS_HEIGHT,
		settings.WALL_HEIGHT,
		settings.CAMERA_HEIGHT,
	);
	const brightness = new Brightness(settings.MAX_DISTANCE, settings.MAX_BRIGHTNESS);
	const game = new Game(map, batchRenderer, raycaster, brightness, player);
	return new GameFacade(game, player, batchRenderer);
}

function createBatchRenderer(settings: SettingsInterface, canvas: OffscreenCanvas): BatchRenderer {
	const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

	if (!ctx) {
		throw new Error("Failed to get 2D context from OffscreenCanvas");
	}

	return new BatchRenderer(
		new Renderer(ctx),
		settings.CANVAS_WIDTH,
		settings.CANVAS_HEIGHT,
		ColorName.BLUE
	);
}
