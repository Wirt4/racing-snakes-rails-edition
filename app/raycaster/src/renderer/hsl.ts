class HSL {
	hue: number;
	saturation: number;
	lightness: number;
	constructor(hue: number, saturation: number, lightness: number) {
		/**
		 * Preconditions: 
		 * hue is a float representing the hue in degrees  between 0 and 360 (inclusive).
		 * saturation is a float representing the saturation as a percentage between 0 and 1 (inclusive).
			* **/
		if (hue < 0 || hue > 360) {
			throw new Error("Hue must be between 0 and 360");
		}
		this.hue = hue;
		if (saturation < 0 || saturation > 1) {
			throw new Error("Saturation must be between 0 and 1");
		}
		this.saturation = saturation;
		this.lightness = lightness;
	}
}
export { HSL };
