import { ColorName } from '../color/color_name';
import { NINETY_DEGREES } from '../geometry/constants';
import { normalizeAngle } from '../utils/utils';
import { BMath } from '../boundedMath/bmath';
class Player {
    constructor(coordinates, angle, speed, turnDistance, color = ColorName.RED) {
        this.angle = angle;
        this.speed = speed;
        this.turnDistance = turnDistance;
        this.isTurning = false;
        this.inbetweens = [];
        this._trail = [];
        this.lastPosition = { x: 0, y: 0 };
        this.bMath = BMath.getInstance();
        this.x = coordinates.x;
        this.y = coordinates.y;
        this.currentHeading = angle;
        this.nextHeading = angle;
        this.lastPosition = { x: this.x, y: this.y };
        this._trail = [{ line: { start: this.lastPosition, end: this.lastPosition }, color: color }];
        this.color = color;
    }
    get trail() {
        return this._trail;
    }
    turnLeft() {
        this.rotate(NINETY_DEGREES);
    }
    turnRight() {
        this.rotate(-NINETY_DEGREES);
    }
    move() {
        this.adjustCamera();
        this.moveAlongHeading();
        this.redirectIfTurned();
    }
    redirectIfTurned() {
        if (this.cameraTurnHasCompleted()) {
            this.redirect();
        }
    }
    redirect() {
        this.isTurning = false;
        this.currentHeading = this.nextHeading;
        this.addTrailSegment();
    }
    adjustCamera() {
        if (this.cameraIsRotating()) {
            this.incrementCamera();
        }
    }
    addTrailSegment() {
        this._trail.push({ line: { start: { x: this.x, y: this.y }, end: { x: this.x, y: this.y } }, color: this.color });
    }
    cameraTurnHasCompleted() {
        return this.inbetweens.length === 0 && this.isTurning;
    }
    growTrail() {
        this._trail[this._trail.length - 1].line.end = { x: this.x, y: this.y };
    }
    moveAlongHeading() {
        this.x += Math.round(this.bMath.cos(this.currentHeading)) * this.speed;
        this.y += this.bMath.sin(this.currentHeading) * this.speed;
        this.growTrail();
    }
    cameraIsRotating() {
        return this.inbetweens.length > 0;
    }
    incrementCamera() {
        this.angle += this.inbetweens.shift();
        this.angle = normalizeAngle(this.angle);
    }
    rotate(angle) {
        if (this.isTurning) {
            return;
        }
        this.isTurning = true;
        this.nextHeading = normalizeAngle(this.currentHeading + angle);
        this.fillInbetweens(angle);
    }
    fillInbetweens(angle) {
        const frames = Math.floor(this.turnDistance / this.speed);
        const sign = angle > 0 ? 1 : -1;
        for (let i = 0; i < frames; i++) {
            this.inbetweens.push(sign * ((Math.PI) / 2) / frames);
        }
    }
}
export { Player };
