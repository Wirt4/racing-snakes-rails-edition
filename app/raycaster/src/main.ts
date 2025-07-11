// test for game loop
import { sleep } from './sleep';
import { Settings } from './settings';
import { Renderer } from './renderer/renderer';
import { Game } from './game/game';
import { ColorName } from './game/color/color_name';
import { GameMap } from './gamemap/map';
import { Raycaster } from './raycaster/raycaster';
import { Brightness } from './brightness/brightness';

async function main(): Promise<void> {
	//below is test data etc.
	const walls = [];
	// for (let i = 0; i < 10; i++) {
	// 	walls.push({ color: ColorName.RED, line: { start: { x: 10 * i, y: 100 }, end: { x: 10 * i, y: 55 } } })
	// 	if (i % 2 == 0) {
	// 		walls.push({ color: ColorName.RED, line: { start: { x: 10 * i, y: 55 }, end: { x: 10 * (i + 1), y: 55 } } })
	// 	}
	// }
	// walls.push({ color: ColorName.YELLOW, line: { start: { x: 0, y: 40 }, end: { x: 100, y: 40 } } })
	//
	const gameMap = new GameMap(1000, 1000, ColorName.GREEN);
	gameMap.playerAngle = 0
	gameMap.playerPosition = { x: 20, y: 54 };
	gameMap.walls = [...walls, ...gameMap.walls];
	const game = new Game(gameMap);
	const renderer = new Renderer("app", Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
	const raycaster = new Raycaster(
		Settings.RESOLUTION,
		Settings.FIELD_OF_VISION,
		Settings.CANVAS_WIDTH,
		Settings.CANVAS_HEIGHT,
		Settings.MAX_DISTANCE);
	const brightness = new Brightness(Settings.MAX_DISTANCE, Settings.MAX_BRIGHTNESS);

	function loop(): void {
		renderer.reset();
		game.draw(renderer, raycaster, brightness);
		game.update();
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
}

main().catch((err) => {
	console.error("Error in main loop:", err);
});
