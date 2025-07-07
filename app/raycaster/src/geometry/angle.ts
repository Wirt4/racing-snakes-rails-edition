export class Angle {
	private _radians: number;

	constructor(radians: number) {
		const fullSweep = 2 * Math.PI;
		this._radians = ((radians % fullSweep) + fullSweep) % fullSweep;
	}

	get radians(): number {
		return this._radians;
	}

	get degrees(): number {
		return this._radians * (180 / Math.PI);
	}

	static fromDegrees(degrees: number): Angle {
		return new Angle(degrees * (Math.PI / 180));
	}

	static fromRadians(radians: number): Angle {
		return new Angle(radians);
	}
}
