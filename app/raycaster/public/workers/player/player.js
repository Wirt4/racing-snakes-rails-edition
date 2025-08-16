import { ColorName } from '../color/color_name';
import { Directions } from '../controls/directions';
export class Player {
    constructor(coordinates, speed, color = ColorName.RED, camera) {
        this.speed = speed;
        this.camera = camera;
        this._trail = [];
        this.lastPosition = { x: 0, y: 0 };
        this.isTurning = false;
        this.x = coordinates.x;
        this.y = coordinates.y;
        this.currentHeading = camera.angle;
        this.lastPosition = { x: this.x, y: this.y };
        const startWall = { line: { start: this.lastPosition, end: this.lastPosition }, color };
        this._trail = [startWall];
        this.color = color;
    }
    get angle() {
        return this.camera.angle;
    }
    get trail() {
        return this._trail;
    }
    hasCollided(arena) {
        // first check if the player is outside the arena
        if (!arena.containsCoordinates(this.x, this.y)) {
            return true;
        }
        // if there's less than 2 segments in the trail, then no collision
        if (this._trail.length < 2) {
            return false;
        }
        // set the trailhead -- it's what is going to be compared
        const trailHead = this._trail[this._trail.length - 1].line;
        const headIsVertical = this.isVertical(trailHead);
        // check every segment except last and penultimate
        for (let i = 0; i < this._trail.length - 2; i++) {
            // if the current  is perpendicular to the last segment, then check for an intersection
            const curSegment = this._trail[i].line;
            const curIsVertical = this.isVertical(curSegment);
            if (headIsVertical !== curIsVertical) {
                // then check for an intersection
                if (headIsVertical && this.isInRange(trailHead, curSegment)) {
                    return true;
                }
                else if (!headIsVertical && this.isInRange(curSegment, trailHead)) {
                    return true;
                }
            }
        }
        return false;
    }
    turnLeft() {
        this.turn(Directions.LEFT);
    }
    turnRight() {
        this.turn(Directions.RIGHT);
    }
    move() {
        this.adjustCamera();
        this.redirectIfTurned();
        this.moveAlongHeading();
    }
    turn(dir) {
        if (!this.isTurning) {
            this.camera.beginTurnExecution(dir);
            this.isTurning = true;
        }
    }
    minY(segment) {
        return this.cmp(segment, false, Math.min);
    }
    maxY(segment) {
        return this.cmp(segment, false, Math.max);
    }
    minX(segment) {
        return this.cmp(segment, true, Math.min);
    }
    maxX(segment) {
        return this.cmp(segment, true, Math.max);
    }
    cmp(segment, isXAxis, cmpFunc) {
        const { start, end } = segment;
        return isXAxis ? cmpFunc(start.x, end.x) : cmpFunc(start.y, end.y);
    }
    redirectIfTurned() {
        if (this.cameraTurnHasCompleted() && this.isTurning) {
            this.redirect();
            this.isTurning = false;
        }
    }
    redirect() {
        this.addTrailSegment();
        this.currentHeading = this.camera.angle;
    }
    adjustCamera() {
        if (this.camera.isRotating) {
            this.camera.adjust();
        }
    }
    addTrailSegment() {
        this._trail.push({
            line: {
                start: { x: this.x, y: this.y },
                end: { x: this.x, y: this.y }
            },
            color: this.color
        });
    }
    cameraTurnHasCompleted() {
        return !this.camera.isRotating;
    }
    growTrail() {
        this._trail[this._trail.length - 1].line.end = { x: this.x, y: this.y };
    }
    moveAlongHeading() {
        this.x += Math.round(Math.cos(this.currentHeading)) * this.speed;
        this.y += Math.round(Math.sin(this.currentHeading)) * this.speed;
        this.growTrail();
    }
    isVertical(segment) {
        return segment.start.x === segment.end.x;
    }
    isInRange(verticalSegment, horizontalSegment) {
        //check if vertical outside horizontal range
        if (verticalSegment.start.x < Math.min(horizontalSegment.start.x, horizontalSegment.end.x)) {
            return false;
        }
        if (verticalSegment.start.x > Math.max(horizontalSegment.start.x, horizontalSegment.end.x)) {
            return false;
        }
        //check if horizontal outside vertical range
        if (horizontalSegment.start.y < Math.min(verticalSegment.start.y, verticalSegment.end.y)) {
            return false;
        }
        return horizontalSegment.start.y <= Math.max(verticalSegment.start.y, verticalSegment.end.y);
    }
}
