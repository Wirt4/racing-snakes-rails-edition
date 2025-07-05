console.log("script loaded");

const app = document.getElementById("app");
const canv = document.createElement("canvas");
canv.id = 'my-house';
canv.width = 300;
canv.height = 300;
app?.appendChild(canv);
