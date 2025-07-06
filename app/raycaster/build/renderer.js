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
    rect(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
    }
    fillColor(color, brightness = 100) {
        const percent = brightness / 100;
        if (percent < 0 || percent > 1) {
            throw new Error("Brightness must be between 0 and 100");
        }
        if (color == 'red') {
            this.context.fillStyle = this.HSLToHex({ h: 1, s: 1, l: brightness });
        }
        else {
            this.context.fillStyle = this.HSLToHex({ h: 120, s: 1, l: brightness });
        }
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
    HSLToHex(hsl) {
        const { h, s, l } = hsl;
        const hDecimal = l / 100;
        const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
        const f = (n) => {
            const k = (n + h / 30) % 12;
            const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            // Convert to Hex and prefix with "0" if required
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, "0");
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}
exports.Renderer = Renderer;
