import { ColorName } from "../color/color_name";
import { hslFactory } from "../hsl/hsl_factory";
class Renderer {
    constructor(context) {
        this.context = context;
        this.hslCache = {};
        this.lastFillColorStyle = "transparent";
        this.lastStrokeColorStyle = "transparent";
    }
    scale(scale) {
        /**
         * Precondition: * - The context is a valid CanvasRenderingContext2D.
         * Postcondition: * - The context is scaled by the specified factor.
         * **/
        this.context.translate(0, this.context.canvas.height);
        this.context.scale(scale, -scale);
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
        /**
         * Precondition: the context is a valid CanvasRenderingContext2D
         * Postcondition: the context is reset to its initial state, clearing any transformations or styles
         */
        this.context.reset();
    }
    strokeWeight(weight) {
        /**
         * Precondition: the context is a valid CanvasRenderingContext2D
         * Postcondition: the context is set to stroke with the specified weight
         */
        this.context.lineWidth = weight;
    }
    line(line) {
        /**
         * Precondition: the context is a valid CanvasRenderingContext2D
         * Postcondition: the context draws a line from (x1, y1) to (x2, y2)
         */
        const { start, end } = line;
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
    }
    rect(origin, width, height) {
        /**
         * Precondition: the context is a valid CanvasRenderingContext2D
         * Postcondition: the context draws a rectangle at the specified coordinates with the specified width and height
         */
        this.context.fillRect(origin.x, origin.y, width, height);
    }
    fillColor(color, brightness = 100) {
        /**
         * Precondition: the context is a valid CanvasRenderingContext2D
         * Postcondition: the context is set to fill with the specified color and brightness - the exact specs are keyed to the mapping of the color name
         */
        if (brightness < 0 || brightness > 100) {
            throw new Error("Brightness must be between 0 and 100");
        }
        const brightnessPercent = brightness / 100;
        let hsl;
        if (color === ColorName.NONE) {
            hsl = this.getCachedHSL(ColorName.WHITE);
        }
        else {
            hsl = this.getCachedHSL(color);
        }
        hsl.lightness = brightnessPercent;
        const hxcd = hsl.toHex();
        if (this.lastFillColorStyle === hxcd) {
            return;
        }
        this.context.fillStyle = hxcd;
        this.lastFillColorStyle = hxcd;
    }
    ellipse(origin, stroke) {
        /**
         * Precondition: the context is a valid CanvasRenderingContext2D
         * Postcondition: the context draws an ellipse at the specified coordinates with the specified stroke weight, the ellipse defaults
         * to a circle of radius 1
         */
        this.context.lineWidth = stroke;
        this.context.ellipse(origin.x, origin.y, 1, 1, 0, 0, 0);
    }
    fillPath(path) {
        /**
         * Precondition: the context is a valid CanvasRenderingContext2D and the path is a valid Path2D object
         * Postcondition: the context fills the specified path with the current fill style
         */
        this.context.fill(path);
    }
    noStroke() {
        /**
         * Precondition: the context is a valid CanvasRenderingContext2D
         * Postcondition: the context is set to not stroke shapes
         */
        if (this.context.strokeStyle === "transparent") {
            return;
        }
        this.context.strokeStyle = "transparent";
    }
    stroke(color) {
        /**
         * Precondition: the color is a valid Color object
         * Postcondition: the context is set to stroke with the specified color
         */
        if (color === this.lastStrokeColorStyle) {
            return;
        }
        this.context.strokeStyle = this.getCachedHSL(color).toHex();
        this.lastStrokeColorStyle = this.context.strokeStyle;
    }
    getCachedHSL(color) {
        if (!this.hslCache[color]) {
            this.hslCache[color] = hslFactory(color);
        }
        return this.hslCache[color];
    }
}
export { Renderer };
