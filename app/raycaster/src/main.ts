//set up the canvas
// assumes target will have an empty div tag with id "app"
const app = document.getElementById("app");
const canv = document.createElement("canvas");
canv.id = 'my-house';
const square_size = 300;
canv.width = square_size;
canv.height = square_size;
app?.appendChild(canv);

//grab the canvas and add a rectangle to it
const canvas = document.getElementById("my-house") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
	throw new Error("Failed to get canvas context");
}
ctx.translate(150, 150);
ctx.rotate((45 * Math.PI) / 180); //experiment with rotation
ctx.translate(-150, -150); // reset translation to origin

ctx.lineWidth = 10;

// Wall
// assets in the CANVAS API are defaulted to black
ctx.strokeStyle = "#8B4513";
ctx.strokeRect(75, 140, 150, 110);

// Door
ctx.fillStyle = "#654321";
ctx.fillRect(130, 190, 40, 60);

// Roof
ctx.strokeStyle = "#A52A2A"; // reddish-brow
ctx.beginPath();
ctx.moveTo(50, 140);
ctx.lineTo(150, 60);
ctx.lineTo(250, 140);
ctx.closePath();
ctx.stroke();
