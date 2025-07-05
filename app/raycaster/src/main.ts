// assumes target will have an empty div tag with id "app"
const app = document.getElementById("app");
const canv = document.createElement("canvas");
canv.id = 'my-house';
const square_size = 300;
canv.width = square_size;
canv.height = square_size;
app?.appendChild(canv);
