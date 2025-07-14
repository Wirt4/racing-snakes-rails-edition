import { Renderer } from '../renderer/renderer';
import { Game } from '../game/game';
import { GameMap } from '../gamemap/map';
import { Raycaster } from '../raycaster/raycaster';
import { Brightness } from '../brightness/brightness';

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
		const map = new GameMap(mapSize, msg.settings.MAP_COLOR, msg.settings.GRID_CELL_SIZE, { rotate: () => { }, move: () => { }, position: { x: 1, y: 1 }, angle: 0 });
		map.walls = msg.mapData.walls;

		game = new Game(map);
		raycaster = new Raycaster(
			msg.settings.RESOLUTION,
			msg.settings.FIELD_OF_VISION,
			msg.settings.CANVAS_WIDTH,
			msg.settings.CANVAS_HEIGHT,
			msg.settings.MAX_DISTANCE
		);
		brightness = new Brightness(msg.settings.MAX_DISTANCE, msg.settings.MAX_BRIGHTNESS);
		startLoop();
	}
	if (msg.type === "KeyDown") {
		game.map.turnPlayer(Math.PI / 4)
	}
};

function startLoop() {
	if (running) return;
	running = true;
	function loop(): void {
		renderer.reset();
		game.draw(renderer, raycaster, brightness);
		game.update();
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
}
