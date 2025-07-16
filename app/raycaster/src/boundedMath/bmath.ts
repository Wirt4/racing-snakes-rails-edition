const cosCache: Map<number, number> = new Map();
const sinCache: Map<number, number> = new Map();
const rootCache: Map<number, number> = new Map();

class BMath {
	private static instance: BMath | null = null;
	private constructor(private decimalPlaces: number) { }
	static getInstance(decimalPlaces: number = 6): BMath {
		if (!BMath.instance) {
			BMath.instance = new BMath(decimalPlaces);
		}
		return BMath.instance;
	}
	cos(x: number): number {
		return this.getCachedValue(cosCache, x, Math.cos);
	}

	sin(x: number): number {
		return this.getCachedValue(sinCache, x, Math.sin);
	}

	sqrt(x: number): number {
		return this.getCachedValue(rootCache, x, Math.sqrt);
	}
	//only for testing, don't use this in production code
	static _reset(): void {
		this.instance = null;
		cosCache.clear();
		sinCache.clear();
		rootCache.clear();
	}

	private getCachedValue(cache: Map<number, number>, key: number, f: Function): number {
		const in_key = this.roundToPlaces(key);
		if (cache.has(in_key)) {
			return cache.get(in_key)!;
		}
		cache.set(in_key, this.roundToPlaces(f(key)));
		return cache.get(in_key)!;
	}

	private roundToPlaces(num: number): number {
		const factor = Math.pow(10, this.decimalPlaces);
		return Math.round(num * factor) / factor;
	}
}

export { BMath }
