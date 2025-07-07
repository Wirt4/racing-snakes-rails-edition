export class Angle {
	private _radians: number;
	private static _ratio: number = 180 / Math.PI;

	constructor(radians: number) {
		const fullSweep = 2 * Math.PI;
		this._radians = ((radians % fullSweep) + fullSweep) % fullSweep;
	}

	get radians(): number {
		return this._radians;
	}

	get degrees(): number {
		return this._radians * Angle._ratio;
	}

	static fromDegrees(degrees: number): Angle {
		return new Angle(degrees / Angle._ratio);
	}

}
