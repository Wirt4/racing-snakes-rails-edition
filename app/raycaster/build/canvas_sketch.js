"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpCanvas = setUpCanvas;
const ctx = setUpCanvas("app", 300, 300);
// Door
ctx.fillStyle = "#AAFF00"; // a nice green
ctx.fillRect(130, 190, 40, 60);
function setUpCanvas(targetId, width, height) {
    //preconditions: width and height are positive integers
    //targetID exists and is an empty div tag
    //postconditions: returns a valid CanvasRendering Context with the specified width and height
    assertIsPositiveInteger(width);
    assertIsPositiveInteger(height);
    const app = document.getElementById(targetId);
    const canv = document.createElement("canvas");
    canv.id = 'my-house'; // todo: rename 
    canv.width = width;
    canv.height = height;
    app === null || app === void 0 ? void 0 : app.appendChild(canv);
    const ctx = canv.getContext("2d");
    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }
    return ctx;
}
function assertIsPositiveInteger(value) {
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error("Value must be a positive integer");
    }
}
