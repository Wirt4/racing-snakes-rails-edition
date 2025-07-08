// test for game loop
import { sleep } from './sleep';
import { Settings } from './settings';
import { Renderer } from './renderer/renderer';
import { Game } from './game/game';
import { ColorName } from './game/color/color_name';
import { GameMap } from './gamemap/map';


async function main(): Promise<void> {
	//below is test data etc.
	const topWall = { color: ColorName.GREEN, line: { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } } } //new Wall(0, 0, 100, 0, ColorName.GREEN);
	const rightWall = { color: ColorName.GREEN, line: { start: { x: 100, y: 0 }, end: { x: 100, y: 100 } } } //new Wall(100, 0, 100, 100, ColorName.GREEN);
	const bottomWall = { color: ColorName.GREEN, line: { start: { x: 100, y: 100 }, end: { x: 0, y: 100 } } } //new Wall(100, 100, 0, 100, ColorName.GREEN);
	const leftWall = { color: ColorName.GREEN, line: { start: { x: 0, y: 100 }, end: { x: 0, y: 0 } } } // new Wall(0, 100, 0, 0, ColorName.GREEN);
	const walls = [
		topWall,
		rightWall,
		bottomWall,
		leftWall,
	];
	for (let i = 0; i < 10; i++) {
		walls.push({ color: ColorName.RED, line: { start: { x: 10 * i, y: 100 }, end: { x: 10 * i, y: 55 } } })
		if (i % 2 == 0) {
			walls.push({ color: ColorName.RED, line: { start: { x: 10 * i, y: 55 }, end: { x: 10 * (i + 1), y: 55 } } })
		}
	}
	walls.push({ color: ColorName.YELLOW, line: { start: { x: 0, y: 40 }, end: { x: 100, y: 40 } } })

	//TODO: Add boundary walls to the game map's constructor, also unit test the grid lines and walls
	const gameMap = new GameMap(100, 100);
	gameMap.playerAngle = 0
	gameMap.playerPosition = { x: 20, y: 50 };
	gameMap.walls = walls;
	const game = new Game(gameMap);
	const renderer = new Renderer("app", Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);

	while (true) {
		renderer.reset();
		game.draw(renderer);
		game.update();
		await sleep(Settings.FRAMES_PER_SECOND);
	}
}

main().catch((err) => {
	console.error("Error in main loop:", err);
});
