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
    scale(scale) {
        /**
         * Precondition: * - The context is a valid CanvasRenderingContext2D.
         * Postcondition: * - The context is scaled by the specified factor.
         * **/
        this.context.scale(scale, scale);
    }
    save() {
        /**
         * Precondition: the context behaves as previously set
         * postcondition: the current state of the context is saved
         **/
        this.context.save();
    }
    restore() {
        /**
         * Precondition: the context behaves as previously expected, including any overwrites since context.save()
         * postcondition: the context is restored to the last saved state, disregarding any changes made since the last save
         **/
        this.context.restore();
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
        const percent = brightness / 200;
        if (percent < 0 || percent > 1) {
            throw new Error("Brightness must be between 0 and 100");
        }
        if (color == 'red') {
            this.context.fillStyle = this.HSLToHex({ h: 1, s: 100, l: brightness });
        }
        else {
            this.context.fillStyle = this.HSLToHex({ h: 120, s: 100, l: brightness });
        }
    }
    ellipse(x, y, stroke) {
        throw new Error("ellipse is not implemented");
    }
    noStroke() {
        throw new Error("noStroke is not implemented");
    }
    stroke(color) {
        throw new Error("stroke is not implemented");
    }
    assertIsPositiveInteger(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("Value must be a positive integer");
        }
    }
    HSLToHex(hsl) {
        const { h, s, l } = hsl;
        const lDecimal = l / 100;
        const a = (s * Math.min(lDecimal, 1 - lDecimal)) / 100;
        const f = (n) => {
            const k = (n + h / 30) % 12;
            const color = lDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, "0");
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}
exports.Renderer = Renderer;
