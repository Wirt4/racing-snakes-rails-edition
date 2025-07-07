class HSL {
	hue: number;
	saturation: number;
	lightness: number;
	constructor(hue: number, saturation: number, lightness: number) {
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
