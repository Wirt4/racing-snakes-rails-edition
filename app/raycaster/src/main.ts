// test for game loop
import { setUpCanvas } from './canvas_sketch';

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function draw(ctx: CanvasRenderingContext2D): void {
	ctx.fillStyle = "#AAFF00"; // a nice green
	ctx.fillRect(130, 190, 40, 60);
	ctx.fillStyle = "#000000"; // black
	ctx.fillText("Hello World", 10, 20);
}

function writeText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
	ctx.fillStyle = "#FFFFFF"; //white
	ctx.font = "16px Arial";
	ctx.fillText(text, x, y);
}

async function main(): Promise<void> {
	const ctx: CanvasRenderingContext2D = setUpCanvas("app", 300, 300);
	let frameCount = 0;
	while (true) {
		ctx.reset();
		draw(ctx);
		writeText(ctx, "Frames: " + frameCount, 10, 40);
		await sleep(1000 / 60); // 60 FPS
		frameCount++;
	}
}

main().catch((err) => {
	console.error("Error in main loop:", err);
});
