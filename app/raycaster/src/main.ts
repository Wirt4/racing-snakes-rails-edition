// test for game loop
import { sleep } from './sleep';
import { Settings } from './settings';
import { Renderer } from './renderer'; // Uncomment if using Renderer class
import { GameMap } from './game-map';

// function writeText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
// 	ctx.fillStyle = "#FFFFFF"; //white
// 	ctx.font = "16px Arial";
// 	ctx.fillText(text, x, y);
// }

async function main(): Promise<void> {
	const renderer = new Renderer("app", Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
	const gameMap = new GameMap();
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
