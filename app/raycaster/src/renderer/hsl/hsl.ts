const globalHSLHexCache = new Map<number, string>();

function hashHSL(h: number, s: number, l: number): number {
	const qH = Math.round(h); // 0–360
	const qS = Math.round(s * 100); // 0–100
	const qL = Math.round(l * 100); // 0–100
	return (qH << 16) | (qS << 8) | qL;
}

class HSL {
	hue: number;
	saturation: number;
	lightness: number;
	constructor(
		hue: number,
		saturation: number,
		lightness: number) {
		/**
		 * Preconditions: 
		 * hue is a float representing the hue in degrees  between 0 and 360 (inclusive).
		 * saturation is a float representing the saturation as a percentage between 0 and 1 (inclusive).
		 * lightness is a float representing the lightness as a percentage between 0 and 1 (inclusive).
		 * * Postconditions:
		 * The HSL object is created with the specified hue, saturation, and lightness values.
		 * **/
		this.assertInRange(hue, 0, 360, "Hue");
		this.hue = hue;
		this.assertSatOrLight(saturation, "Saturation");
		this.saturation = saturation;
		this.assertSatOrLight(lightness, "Lightness");
		this.lightness = lightness;
	}

	toHex(): string {
		/**
		 * Preconditions: 
		 * The HSL object has valid hue, saturation, and lightness values.
		 * Postconditions:
		 * Returns a string representing the color in hexadecimal format.
		 */
		const h = this.hue;
		const s = this.saturation;
		const l = this.lightness;

		const key = hashHSL(h, s, l);
		const cached = globalHSLHexCache.get(key);
		if (cached) return cached;

		const chomaticAdjustmentFactor = this.saturation * Math.min(this.lightness, 1 - this.lightness);
		const redHex = this.colorChannelToHex(0, chomaticAdjustmentFactor);
		const greenHex = this.colorChannelToHex(8, chomaticAdjustmentFactor);
		const blueHex = this.colorChannelToHex(4, chomaticAdjustmentFactor);
		return `#${redHex}${greenHex}${blueHex}`;
	}


	private colorChannelToHex(channel: number, adjustmentFactor: number): string {

		const wheelColor = (channel + this.hue / 30) % 12;
		const color = this.lightness - adjustmentFactor * Math.max(Math.min(wheelColor - 3, 9 - wheelColor, 1), -1);

		return Math.round(255 * color)
			.toString(16)
			.toUpperCase()
			.padStart(2, "0");
	}


	private assertSatOrLight(value: number, name: string): void {
		this.assertInRange(value, 0, 1, name);
	}

	private assertInRange(value: number, min: number, max: number, name: string): void {
		if (value < min || value > max) {
			throw new Error(`${name} must be between ${min} and ${max}`);
		}
	}
}
export { HSL };
