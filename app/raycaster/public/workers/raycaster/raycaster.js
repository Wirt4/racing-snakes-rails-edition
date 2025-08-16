import { assertIsPositiveInteger, assertIsNonNegative, assertIsPositive } from '../utils/utils';
import { FULL_CIRCLE, NINETY_DEGREES } from '../geometry/constants';
import { BMath } from '../boundedMath/bmath';
import { ColorName } from '../color/color_name';
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
    castRay(origin, angle, walls, gridLines) {
        const ray = new Ray(origin, angle);
        ray.findClosestHit(walls);
        const distance = ray.wallDistance > 0 ? ray.wallDistance : this.maxDistance;
        const intersection = ray.wallIntersection;
        const color = ray.wallColor;
        const gridHits = ray.gridHits(gridLines, distance);
        return {
            distance,
            intersection,
            color,
            gridHits
        };
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
class Ray {
    constructor(position, angle) {
        this.x3 = -1;
        this.x4 = -1;
        this.y1 = -1;
        this.y2 = -1;
        this.y3 = -1;
        this.y4 = -1;
        this.denominator = -1;
        this._wallDistance = -1;
        this._wallColor = ColorName.NONE;
        this._wallIntersection = { x: -1, y: -1 };
        const { x, y } = position;
        this.x1 = x;
        this.y1 = y;
        const offset = 10;
        this.x2 = this.x1 + (offset * Math.cos(angle));
        this.y2 = this.y1 + (offset * Math.sin(angle));
    }
    findClosestHit(walls) {
        this._wallDistance = null;
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            const intersection = this.findIntersection(wall.line);
            if (intersection !== null) {
                if (this._wallDistance === null || intersection.distance < this._wallDistance) {
                    this.setValues(intersection, wall.color);
                }
            }
        }
    }
    get wallIntersection() {
        return this._wallIntersection;
    }
    get wallDistance() {
        return this._wallDistance || -1;
    }
    get wallColor() {
        return this._wallColor;
    }
    gridHits(gridLines, maxDistance) {
        const result = new Array();
        for (let i = 0; i < gridLines.length; i++) {
            const intersection = this.findIntersection(gridLines[i]);
            if (intersection !== null && intersection.distance < maxDistance) {
                result.push(intersection.distance);
            }
        }
        return result;
    }
    findIntersection(lineSegment) {
        this.x3 = lineSegment.start.x;
        this.x4 = lineSegment.end.x;
        this.y3 = lineSegment.start.y;
        this.y4 = lineSegment.end.y;
        //denominator is (x1-x2)(y3-y4)-(y1-y2)(x3-x4)
        this.denominator = (this.x1 - this.x2) * (this.y3 - this.y4) - (this.y1 - this.y2) * (this.x3 - this.x4);
        if (this.denominator === 0) {
            return null;
        }
        const x = this.calculateIntersectionCoordinate(this.x1, this.x2, this.x3, this.x4);
        const y = this.calculateIntersectionCoordinate(this.y1, this.y2, this.y3, this.y4);
        if (!this.isValidIntersection(x, y)) {
            return null;
        }
        const distance = this.calculateDistance(x, y);
        return { coordinates: { x, y }, distance };
    }
    calculateDistance(x, y) {
        //pythagorean theorem
        const sum = Math.pow(x - this.x1, 2) + Math.pow(y - this.y1, 2);
        return Math.sqrt(sum);
    }
    calculateIntersectionCoordinate(p1, p2, p3, p4) {
        const variableA = p3 - p4;
        const variableB = p1 - p2;
        //numerator = (x1*y2 - y1*x2)variableA-variableB(x3*y4- y3*x4)
        const segmentA = (this.x1 * this.y2 - this.y1 * this.x2) * variableA;
        const segmentB = variableB * (this.x3 * this.y4 - this.y3 * this.x4);
        const numerator = segmentA - segmentB;
        return numerator / this.denominator;
    }
    setValues(intersection, color) {
        this._wallDistance = intersection.distance;
        this._wallColor = color;
        this._wallIntersection = intersection.coordinates;
    }
    isValidIntersection(x, y) {
        let result = false;
        //  intersection must be in front of the ray
        if (this.isBehind(x, y)) {
            return result;
        }
        // the line segment must contain the intersection
        if (!this.targetContains(x, y)) {
            return result;
        }
        result = true;
        return result;
    }
    isBehind(x, y) {
        let result = false;
        if (this.x1 === this.x2) {
            //check the y axis
            result = this.pointPrecedes(y, this.y1, this.y2);
        }
        else {
            //check the x axis
            result = this.pointPrecedes(x, this.x1, this.x2);
        }
        return result;
    }
    pointPrecedes(coordinatePoint, rayOrigin, rayPoint) {
        let result = false;
        if (coordinatePoint <= rayOrigin && rayOrigin < rayPoint) {
            result = true;
        }
        if (coordinatePoint >= rayOrigin && rayOrigin > rayPoint) {
            result = true;
        }
        return result;
    }
    targetContains(x, y) {
        let result = false;
        if (this.x3 === this.x4) {
            result = this.inRange(y, this.y3, this.y4);
        }
        else {
            result = this.inRange(x, this.x3, this.x4);
        }
        return result;
    }
    inRange(coordinatePoint, startRange, endRange) {
        let result = false;
        // if min(start,end) <= coordinatePoint <= max(start, end) , result is true
        if (Math.min(startRange, endRange) <= coordinatePoint) {
            if (coordinatePoint <= Math.max(startRange, endRange)) {
                result = true;
            }
        }
        return result;
    }
}
export { Raycaster };
