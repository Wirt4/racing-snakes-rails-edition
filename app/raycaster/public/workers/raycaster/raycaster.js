import { assertIsPositiveInteger, assertIsNonNegative, assertIsPositive } from '../utils/utils';
import { FULL_CIRCLE, NINETY_DEGREES } from '../geometry/constants';
import { BMath } from '../boundedMath/bmath';
class Raycaster {
    constructor(resolution, fieldOfView, screenWidth, screenHeight, maxDistance = 1000, horizonY, wallHeight, cameraHeight, rays = new Float32Array(resolution)) {
        this.resolution = resolution;
        this.fieldOfView = fieldOfView;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.maxDistance = maxDistance;
        this.horizonY = horizonY;
        this.wallHeight = wallHeight;
        this.cameraHeight = cameraHeight;
        this.rays = rays;
        this.bMath = BMath.getInstance();
        /**
         *invariants: fieldOfView is between 0 and 2*Math.PI
         * resolution is a positive integer
         **/
        this.fieldOfView = fieldOfView;
        assertIsPositiveInteger(this.resolution);
        if (this.fieldOfView < 0 || this.fieldOfView > FULL_CIRCLE) {
            throw new Error("Field of view must be between 0 and 2*Math.PI");
        }
        this.offsets = [];
        const step = this.fieldOfView / this.resolution;
        for (let i = this.resolution - step; i >= 0; i--) {
            this.offsets.push(i * step);
        }
        this.fovOffset = this.fieldOfView / 2;
        const aspectRatio = screenWidth / screenHeight;
        const verticalFOV = 2 * Math.atan(Math.tan(this.fieldOfView / 2) / aspectRatio);
        this.focalLength = this.screenWidth / (2 * Math.tan(verticalFOV / 2));
    }
    fillRaysInto(rays, viewerAngle) {
        for (let i = 0; i < this.resolution; i++) {
            rays[i] = this.normalizeAngle(viewerAngle - this.fovOffset + this.offsets[i]);
        }
    }
    getViewRays(viewerAngle) {
        /*Precondition: 0<=viewerAngle<=2*Math.PI
         * Postconditions:
         * returns an array of rays
         * each ray is also between 0 and 2* math.pi (inclusive)
         * The length of the array is equal to the resolution
         * the array is arranged from
         */
        this.fillRaysInto(this.rays, viewerAngle);
        return this.rays;
    }
    removeFishEye(distance, centerAngle, relativeAngle) {
        /**
         * Precondition: distance is a positive number, angle is between 0 and 2*Math.PI
         * Postcondition: returns the corrected distance, the greater the distance between the center and relative angle, the greater the correction
         * This is to account for the fish-eye effect in a raycaster
         */
        if (this.fieldOfView >= NINETY_DEGREES) {
            return distance; //no correction needed for wide FOV
        }
        return distance * this.bMath.cos(relativeAngle - centerAngle);
    }
    wallHeightToSliceHeight(distance, height) {
        /**
         * Precondition: distance is a non-negative number, height is a positive number
         * Postcondition: returns the height of the slice in pixels, must be a positive number
         * */
        assertIsNonNegative(distance);
        assertIsPositive(height);
        if (distance === 0) {
            return this.screenHeight;
        }
        const wallBase = 0; // world Y = 0
        const wallTop = wallBase + this.wallHeight;
        // distances from eye
        const topOffset = wallTop - this.cameraHeight;
        const bottomOffset = wallBase - this.cameraHeight;
        // project both
        const topY = this.horizonY - (topOffset * this.focalLength) / distance;
        const bottomY = this.horizonY - (bottomOffset * this.focalLength) / distance;
        return bottomY - topY;
    }
    calculateBrightness(distance) {
        if (distance > this.maxDistance) {
            return 0;
        }
        return 100 * (1 - (distance / this.maxDistance));
    }
    normalizeAngle(angle) {
        if (angle < 0) {
            return angle + FULL_CIRCLE;
        }
        if (angle > FULL_CIRCLE) {
            return angle - FULL_CIRCLE;
        }
        return angle;
    }
}
export { Raycaster };
