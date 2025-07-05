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
const canvas = document.getElementById(canv.id) as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
	throw new Error("Failed to get canvas context");
}
const center_xy: number = square_size / 2;
ctx.translate(center_xy, center_xy); // translate to center of canvas
ctx.rotate((45 * Math.PI) / 180); //experiment with rotation
ctx.translate(-center_xy, -center_xy); // reset translation to origin



// Door
ctx.fillStyle = "#AAFF00"; // a nice green
ctx.fillRect(130, 190, 40, 60);
