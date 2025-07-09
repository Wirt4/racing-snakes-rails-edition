// test for game loop
import { sleep } from './sleep';
import { Settings } from './settings';
import { Renderer } from './renderer/renderer';
import { Game } from './game/game';
import { ColorName } from './game/color/color_name';
import { GameMap } from './gamemap/map';
import { Raycaster } from './raycaster/raycaster';


async function main(): Promise<void> {
	//below is test data etc.
	const walls = [];
	for (let i = 0; i < 10; i++) {
		walls.push({ color: ColorName.RED, line: { start: { x: 10 * i, y: 100 }, end: { x: 10 * i, y: 55 } } })
		if (i % 2 == 0) {
			walls.push({ color: ColorName.RED, line: { start: { x: 10 * i, y: 55 }, end: { x: 10 * (i + 1), y: 55 } } })
		}
	}
	walls.push({ color: ColorName.YELLOW, line: { start: { x: 0, y: 40 }, end: { x: 100, y: 40 } } })

	const gameMap = new GameMap(100, 100, ColorName.GREEN);
	gameMap.playerAngle = 0
	gameMap.playerPosition = { x: 20, y: 50 };
	gameMap.walls = [...walls, ...gameMap.walls];
	const game = new Game(gameMap);
	const renderer = new Renderer("app", Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
	const raycaster = new Raycaster(Settings.RESOLUTION, Math.PI / 2);
	while (true) {
		renderer.reset();
		game.draw(renderer, raycaster);
		game.update();
		await sleep(Settings.FRAMES_PER_SECOND);
	}
}

main().catch((err) => {
	console.error("Error in main loop:", err);
});
