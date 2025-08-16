const globalHSLHexCache = new Map();
function hashHSL(h, l) {
    const qH = Math.round(h / 20) * 20;
    const qS = 100;
    const qL = Math.round(l * 16) / 16;
    return ((qH & 0xFF) << 16) | (Math.round(qS * 100) << 8) | Math.round(qL * 100);
}
class HSL {
    constructor(hue, saturation, lightness) {
        /**
         * Preconditions:
         * hue is a float representing the hue in degrees  between 0 and 360 (inclusive).
         * saturation is a float representing the saturation as a percentage between 0 and 1 (inclusive).
         * lightness is a float representing the lightness as a percentage between 0 and 1 (inclusive).
         * * Postconditions:
         * The HSL object is created with the specified hue, saturation, and lightness values.
         * **/
        this.assertSatOrLight(lightness, "Lightness");
        this.assertInRange(hue, 0, 360, "Hue");
        this.assertSatOrLight(saturation, "Saturation");
        this.hue = Math.round(hue / 20) * 20; //Limit hues to 16 -- 256 colors
        this.lightness = Math.round(lightness * 16) / 16; //Limit lightness to steps of 16 increments
        this.saturation = 1; //Math.round(saturation * 4) / 4; // 4 levels of saturation
    }
    toHex() {
        /**
         * Preconditions:
         * The HSL object has valid hue, saturation, and lightness values.
         * Postconditions:
         * Returns a string representing the color in hexadecimal format.
         */
        const key = hashHSL(this.hue, this.lightness);
        const cached = globalHSLHexCache.get(key);
        if (cached)
            return cached;
        const chomaticAdjustmentFactor = this.saturation * Math.min(this.lightness, 1 - this.lightness);
        const redHex = this.colorChannelToHex(0, chomaticAdjustmentFactor);
        const greenHex = this.colorChannelToHex(8, chomaticAdjustmentFactor);
        const blueHex = this.colorChannelToHex(4, chomaticAdjustmentFactor);
        globalHSLHexCache.set(key, `#${redHex}${greenHex}${blueHex}`);
        return globalHSLHexCache.get(key) || "#000000"; // Fallback in case of unexpected error
    }
    colorChannelToHex(channel, adjustmentFactor) {
        const wheelColor = (channel + this.hue / 30) % 12;
        const color = this.lightness - adjustmentFactor * Math.max(Math.min(wheelColor - 3, 9 - wheelColor, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .toUpperCase()
            .padStart(2, "0");
    }
    assertSatOrLight(value, name) {
        this.assertInRange(value, 0, 1, name);
    }
    assertInRange(value, min, max, name) {
        if (value < min || value > max) {
            throw new Error(`${name} must be between ${min} and ${max}`);
        }
    }
}
export { HSL };
