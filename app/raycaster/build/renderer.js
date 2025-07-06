"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
class Renderer {
    constructor(targetId, width, height) {
        this.assertIsPositiveInteger(width);
        this.assertIsPositiveInteger(height);
        const app = document.getElementById(targetId);
        if (!app) {
            throw new Error(`Element with id ${targetId} not found`);
        }
        const canvas = document.createElement("canvas");
        canvas.id = 'game-window';
        canvas.width = width;
        canvas.height = height;
        app.appendChild(canvas);
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Failed to get canvas context");
        }
        this.context = context;
    }
    reset() {
        this.context.reset();
    }
    draw() {
        this.context.fillStyle = "#AAFF00"; // a nice green
        this.context.fillRect(130, 190, 40, 60);
    }
    strokeWeight(weight) {
        //another throwaway, shapes will not natively have strokes
    }
    line(x1, y1, x2, y2) {
        //possible future implementation
    }
    fillColor(color) {
        //stub, need a cleaner interface
    }
    ellipse(x, y, stroke) { }
    noStroke() {
        //this is a stub and a throwaway, shapes will not natively have strokes
    }
    stroke(color) {
        //stub
    }
    assertIsPositiveInteger(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("Value must be a positive integer");
        }
    }
}
exports.Renderer = Renderer;
