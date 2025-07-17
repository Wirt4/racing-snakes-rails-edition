export class Angle {
    constructor(radians) {
        const fullSweep = 2 * Math.PI;
        this._radians = ((radians % fullSweep) + fullSweep) % fullSweep;
    }
    get radians() {
        return this._radians;
    }
    get degrees() {
        return this._radians * Angle._ratio;
    }
    static fromDegrees(degrees) {
        return new Angle(degrees / Angle._ratio);
    }
}
Angle._ratio = 180 / Math.PI;
