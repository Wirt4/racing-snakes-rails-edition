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
import { sleep } from '../sleep';
import { Arena } from '../arena/arena';

let game: Game;
let player: Player;
let batchRenderer: BatchRenderer;
let raycaster: Raycaster;
let brightness: Brightness;

let running = false;

onmessage = (e) => {
	const msg = e.data;

	if (msg.type === "init") {
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

		const camera = new Camera(msg.settings.TURN_TIME, msg.settings.CAMERA_ANGLE);
		player = new Player({ x: 10, y: 10 }, msg.settings.PLAYER_SPEED, msg.settings.PLAYER_COLOR, camera);
		const arenaSize = { width: msg.settings.ARENA_WIDTH, height: msg.settings.ARENA_HEIGHT };
		const arena = new Arena(arenaSize,
			msg.settings.GRID_CELL_SIZE,
			ColorName.BLACK,
		);
		const map = new GameMap(arena, player);

		raycaster = new Raycaster(
			msg.settings.RESOLUTION,
			msg.settings.FIELD_OF_VISION,
			msg.settings.CANVAS_WIDTH,
			msg.settings.CANVAS_HEIGHT,
			msg.settings.MAX_DISTANCE,
			msg.settings.HORIZON_LINE_RATIO * msg.settings.CANVAS_HEIGHT,
			msg.settings.WALL_HEIGHT,
			msg.settings.CAMERA_HEIGHT,
			msg.settings.CELL_SIZE
		);
		brightness = new Brightness(msg.settings.MAX_DISTANCE, msg.settings.MAX_BRIGHTNESS);
		game = new Game(map, batchRenderer, raycaster, brightness, player);
		startLoop();
	}
	if (msg.type === "turn") {
		if (msg.direction === Directions.LEFT) {
			player.turnLeft()
		} else if (msg.direction === Directions.RIGHT) {
			player.turnRight();
		}
	}
};

function startLoop(): void {
	/**
	 * Preconditions:
	 * The loop is not already running
	 * Postconditions:
	 * loop does not terminate on its own
	 * calls requestAnimationFrame to continue the loop
		* */
	if (running) return;
	running = true;
	async function loop(): Promise<void> {
		batchRenderer.clear();
		game.update();
		game.draw();
		await sleep(30);
		if (!game.isGameOver()) {
			requestAnimationFrame(loop);
		} else {
			running = false;
			emitGameover();
		}
	};
	requestAnimationFrame(loop);
}

/**
 *This function emits the gameover message
 **/
function emitGameover(): void {
	self.postMessage({
		type: 'gameover',
		endpoint: '/gameover'
	})
}

