import { BrightnessInterface } from './interface';
export class Brightness implements BrightnessInterface {
	private readonly maxDistance: number;

	constructor(maxDistance: number) {
		this.maxDistance = maxDistance;
	}

	calculateBrightness(distance: number): number {
		if (distance > this.maxDistance) {
			return 0;
		}
		return (1 - (distance / this.maxDistance)) * 100;
	}
}
