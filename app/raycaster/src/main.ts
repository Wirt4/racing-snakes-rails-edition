// test for game loop
import { setUpCanvas } from './canvas_sketch';

const ctx: CanvasRenderingContext2D = setUpCanvas("app", 300, 300);
ctx.fillStyle = "#AAFF00"; // a nice green
ctx.fillRect(130, 190, 40, 60);
