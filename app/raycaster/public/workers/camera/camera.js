import { Directions } from '../controls/directions';
import { NINETY_DEGREES } from '../geometry/constants';
import { normalizeAngle } from '../utils/utils';
class Camera {
    constructor(turnTime, angle) {
        this.turnTime = turnTime;
        this.angle = angle;
        this.frameCount = 0;
        this.step = 0;
        this.startAngle = 0;
        this.targetAngle = 0;
        this.rotating = false;
        this.currentTurnDirection = null;
        this.step = NINETY_DEGREES / turnTime;
    }
    get isRotating() {
        return this.rotating;
    }
    beginTurnExecution(turnDirection) {
        this.currentTurnDirection = turnDirection;
        this.startAngle = this.angle;
        this.setTargetAngleAndStep();
        this.frameCount = 0;
        this.rotating = true;
    }
    adjust() {
        if (!this.rotating) {
            return;
        }
        this.incrementAngle();
        this.snapToPrecision();
    }
    incrementAngle() {
        this.frameCount++;
        this.angle = normalizeAngle(this.angle + this.step);
    }
    snapToPrecision() {
        if (this.frameCount >= this.turnTime) {
            this.angle = this.targetAngle;
            this.rotating = false;
        }
    }
    setTargetAngleAndStep() {
        const sign = this.currentTurnDirection === Directions.LEFT ? 1 : -1;
        this.initializeTargetAngleAndStep(sign);
    }
    initializeTargetAngleAndStep(sign) {
        this.targetAngle = normalizeAngle(this.startAngle + (sign * NINETY_DEGREES));
        this.step = sign * (NINETY_DEGREES / this.turnTime);
    }
}
export { Camera };
