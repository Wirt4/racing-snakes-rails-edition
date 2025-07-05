"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test for game loop
const canvas_sketch_1 = require("./canvas_sketch");
const ctx = (0, canvas_sketch_1.setUpCanvas)("app", 300, 300);
ctx.fillStyle = "#AAFF00"; // a nice green
ctx.fillRect(130, 190, 40, 60);
