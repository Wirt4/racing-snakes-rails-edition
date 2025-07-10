import { BrightnessInterface } from './interface';
export class Brightness implements BrightnessInterface {
	private readonly maxDistance: number;
	private readonly maxBrightness: number;
	constructor(maxDistance: number, maxBrightness: number = 100) {
		this.maxDistance = maxDistance;
		this.maxBrightness = maxBrightness;
	}

	calculateBrightness(distance: number): number {
		const ratio = distance / this.maxDistance;
		if (ratio > 1) {
			return 0;
		}
		return (1 - ratio) * this.maxBrightness;
	}
}
