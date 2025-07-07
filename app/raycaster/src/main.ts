// test for game loop
import { sleep } from './sleep';
import { Settings } from './settings';
import { Renderer } from './renderer';
import { GameMap } from './game-map';
import { Player } from './player';
import { Wall } from './wall';
import { ColorName } from './color/color_name';


async function main(): Promise<void> {
	const topWall = new Wall(0, 0, 58, 0, ColorName.GREEN);
	const rightWall = new Wall(100, 0, 100, 100, ColorName.GREEN);
	const bottomWall = new Wall(100, 100, 0, 100, ColorName.GREEN);
	const leftWall = new Wall(0, 100, 0, 0, ColorName.GREEN);
	const walls = [
		topWall,
		rightWall,
		bottomWall,
		leftWall,
	];

	const player = new Player({ x: 1, y: 50 });
	const gameMap = new GameMap(player, walls);
	const renderer = new Renderer("app", Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
	while (true) {
		renderer.reset();
		gameMap.draw(renderer);
		gameMap.update();
		await sleep(Settings.FRAMES_PER_SECOND);
	}
}

main().catch((err) => {
	console.error("Error in main loop:", err);
});
