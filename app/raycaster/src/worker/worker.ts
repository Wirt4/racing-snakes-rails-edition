import { Renderer } from '../renderer/renderer';
import { Game } from '../game/game';
import { GameMap } from '../gamemap/map';
import { Raycaster } from '../raycaster/raycaster';
import { Brightness } from '../brightness/brightness';
import { sleep } from '../sleep';

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
		//note the hardcoded values here, these should be replaced with the settings from the main thread
		//
		const map = new GameMap(1000, 1000, msg.settings.MAP_COLOR);
		map.playerPosition = msg.mapData.playerPosition;
		map.playerAngle = msg.mapData.playerAngle;
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
	if (msg.type === "mouseTurn") {
		game.map.turnPlayer(msg.angleDelta);
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
