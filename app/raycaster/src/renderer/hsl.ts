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
		return "#FF000";
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
