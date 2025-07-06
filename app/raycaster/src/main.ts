// test for game loop
import { sleep } from './sleep';
import { Settings } from './settings';
import { Renderer } from './renderer';
import { GameMap } from './game-map';
import { Player } from './player';
import { Wall } from './wall';
import { Color } from './color';


async function main(): Promise<void> {
	const topWall = new Wall(1, 1, 58, 1, Color.GREEN);
	const rightWall = new Wall(58, 1, 58, 58, Color.GREEN);
	const bottomWall = new Wall(58, 58, 1, 58, Color.GREEN);
	const leftWall = new Wall(1, 58, 1, 1, Color.GREEN);
	const walls = [
		topWall,
		new Wall(40, 30, 5, 10, Color.RED),
		new Wall(5, 10, 70, 30, Color.RED),
		rightWall,
		bottomWall,
		leftWall,
	];

	const player = new Player(4.5, 4.5, 0)

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
