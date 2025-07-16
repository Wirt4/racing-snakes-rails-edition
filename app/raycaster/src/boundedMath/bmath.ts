const cosCache: Map<number, number> = new Map();
const sinCache: Map<number, number> = new Map();
class BMath {
	constructor(private decimalPlaces: number) { }

	cos(x: number): number {
		const in_x = this.roundToPlaces(x);
		if (cosCache.has(in_x)) {
			return cosCache.get(in_x)!;
		}
		cosCache.set(in_x, this.roundToPlaces(Math.cos(x)));
		return cosCache.get(in_x)!;
	}

	sin(x: number): number {
		const in_x = this.roundToPlaces(x);
		if (sinCache.has(in_x)) {
			return sinCache.get(in_x)!;
		}
		sinCache.set(in_x, this.roundToPlaces(Math.sin(x)));
		return sinCache.get(in_x)!;
	}

	private roundToPlaces(num: number): number {
		const factor = Math.pow(10, this.decimalPlaces);
		return Math.round(num * factor) / factor;
	}
}

export { BMath }
