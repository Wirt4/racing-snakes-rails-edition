// test for game loop
import { sleep } from './sleep';
import { Settings } from './settings';
import { Renderer } from './renderer';
import { Game } from './game/game';
import { Player } from './player';
import { Wall } from './wall';
import { ColorName } from './game/color/color_name';


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
	const gridLines: Wall[] = [];
	for (let i = 0; i < 100; i++) {
		gridLines.push(new Wall(i, 0, i, 100, ColorName.BLUE));
		gridLines.push(new Wall(0, i, 100, i, ColorName.BLUE));
	}

	const player = new Player({ x: 20, y: 50 });
	const game = new Game(player, walls, gridLines);
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
