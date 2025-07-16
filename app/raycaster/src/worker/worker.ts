import { Renderer } from '../renderer/renderer';
import { Game } from '../game/game';
import { GameMap } from '../gamemap/map';
import { Raycaster } from '../raycaster/raycaster';
import { Brightness } from '../brightness/brightness';
import { Player } from '../player/player';

let game: Game;
let renderer: Renderer;
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

		renderer = new Renderer(ctx);
		const mapSize = { width: msg.settings.CANVAS_HEIGHT, height: msg.settings.CANVAS_WIDTH };
		const player = new Player({ x: 10, y: 10 }, 0, msg.settings.PLAYER_SPEED, msg.settings.PLAYER_TURN_DISTANCE);
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
		game = new Game(map, renderer, raycaster, brightness, msg.settings.HUD_ON);
		startLoop();
	}
	if (msg.type === "turn") {
		if (msg.direction === "left") {
			game.map.turnPlayer(Math.PI / 2) //reverse the direction because the y axis is inverted in the canvas
		} else if (msg.direction === "right") {
			game.map.turnPlayer(-Math.PI / 2); //reverse the direction because the y axis is inverted in the canvas
		}
	}
};

function startLoop(): void {
	if (running) return;
	running = true;
	function loop(): void {
		renderer.reset();
		game.draw();
		debugger;
		game.update();
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
}
