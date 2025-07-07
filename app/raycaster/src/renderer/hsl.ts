class HSL {
	hue: number;
	saturation: number;
	constructor(hue: number, saturation: number) {
		/**
		 * Precondition: hue is a float representing the hue in degrees  between 0 and 360 (inclusive).
			* **/
		if (hue < 0 || hue > 360) {
			throw new Error("Hue must be between 0 and 360");
		}
		this.hue = hue;
		this.saturation = saturation;
	}
}
export { HSL };
