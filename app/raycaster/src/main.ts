// test for game loop
import { sleep } from './sleep';
import { Settings } from './settings';
import { Renderer } from './renderer';
import { GameMap } from './game-map';
import { Player } from './player';
import { Wall } from './wall';
import { ColorName } from './color/color_name';


async function main(): Promise<void> {
	const topWall = new Wall(0, 0, 100, 0, ColorName.GREEN);
	const rightWall = new Wall(100, 0, 100, 100, ColorName.GREEN);
	const bottomWall = new Wall(100, 100, 0, 100, ColorName.GREEN);
	const leftWall = new Wall(0, 100, 0, 0, ColorName.GREEN);
	const walls = [
		topWall,
		rightWall,
		bottomWall,
		leftWall,
	];
	for (let i = 0; i < 10; i++) {
		walls.push(new Wall(i * 10, 0, i * 10, 49, ColorName.RED));
		if (i % 2 == 0) {
			walls.push(new Wall(i * 10, 49, (i + 1) * 10, 49, ColorName.RED));
		}
	}
	walls.push(new Wall(0, 51, 100, 51, ColorName.YELLOW));

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
