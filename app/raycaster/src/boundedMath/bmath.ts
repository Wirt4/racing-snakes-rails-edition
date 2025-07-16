export class BMath {
	constructor(private decimalPlaces: number) { }
	cos(x: number): number {
		const factor = Math.pow(10, this.decimalPlaces);
		return Math.round(Math.cos(x) * factor) / factor;
	}
}
