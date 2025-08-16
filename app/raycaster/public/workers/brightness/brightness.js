export class Brightness {
    constructor(maxDistance, maxBrightness = 100) {
        this.maxDistance = maxDistance;
        this.maxBrightness = maxBrightness;
    }
    calculateBrightness(distance) {
        const ratio = distance / this.maxDistance;
        if (ratio > 1) {
            return 0;
        }
        return (1 - ratio) * this.maxBrightness;
    }
}
