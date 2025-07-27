import { Renderer } from '../renderer/renderer';
import { Game } from '../game/game';
import { GameMap } from '../gamemap/map';
import { Raycaster } from '../raycaster/raycaster';
import { Brightness } from '../brightness/brightness';
import { Player } from '../player/player';
import { Directions } from '../controls/directions';
import { Camera } from '../camera/camera';
import { BatchRenderer } from "../batchRenderer/batchRenderer";
import { ColorName } from '../color/color_name';

import { MessageRouter } from '../messageRouter/messageRouter'
import { GameFacade } from '../gameFacade/gameFacade';

let gameFacade: GameFacade;

let game: Game;
let player: Player;
let batchRenderer: BatchRenderer;
let raycaster: Raycaster;
let brightness: Brightness;

const router = new MessageRouter({
	init(msg) {
		const ctx = msg.canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
		if (!ctx) {
			console.error("Failed to get 2D context from OffscreenCanvas");
			return;
		}

		batchRenderer = new BatchRenderer(
			new Renderer(ctx),
			msg.settings.CANVAS_WIDTH,
			msg.settings.CANVAS_HEIGHT,
			ColorName.BLUE);

		const mapSize = { width: msg.settings.ARENA_WIDTH, height: msg.settings.ARENA_HEIGHT };
		const camera = new Camera(msg.settings.TURN_TIME, msg.settings.CAMERA_ANGLE);
		player = new Player({ x: 10, y: 10 }, msg.settings.PLAYER_SPEED, msg.settings.PLAYER_COLOR, camera);
		const map = new GameMap(mapSize, msg.settings.MAP_COLOR, msg.settings.GRID_CELL_SIZE, player);

		raycaster = new Raycaster(
			msg.settings.RESOLUTION,
			msg.settings.FIELD_OF_VISION,
			msg.settings.CANVAS_WIDTH,
			msg.settings.CANVAS_HEIGHT,
			msg.settings.MAX_DISTANCE,
			msg.settings.HORIZON_LINE_RATIO * msg.settings.CANVAS_HEIGHT,
			msg.settings.WALL_HEIGHT,
			msg.settings.CAMERA_HEIGHT,
		);
		brightness = new Brightness(msg.settings.MAX_DISTANCE, msg.settings.MAX_BRIGHTNESS);
		game = new Game(map, batchRenderer, raycaster, brightness, player);

		gameFacade = new GameFacade(game, player, batchRenderer);
		gameFacade.startLoop();
	},
	turn(msg) {
		if (!gameFacade) return;
		if (msg.direction === Directions.LEFT) gameFacade.turnLeft();
		else if (msg.direction === Directions.RIGHT) gameFacade.turnRight();
	},
})

onmessage = (e) => { router.handleMessage(e) };

