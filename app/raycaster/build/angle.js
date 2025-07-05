"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angle = void 0;
class Angle {
    constructor(radians) {
        this._radians = radians;
    }
    get radians() {
        return this._radians;
    }
    get degrees() {
        return this._radians * (180 / Math.PI);
    }
    static fromDegrees(degrees) {
        return new Angle(degrees * (Math.PI / 180));
    }
    static fromRadians(radians) {
        return new Angle(radians);
    }
}
exports.Angle = Angle;
