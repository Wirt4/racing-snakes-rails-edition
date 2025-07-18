
import { Directions } from '../controls/directions';
import { NINETY_DEGREES, FULL_CIRCLE } from '../geometry/constants';
import { normalizeAngle } from '../utils/utils';

class Camera {
	private frameCount: number = 0;
	private step: number = 0;
	private startAngle: number = 0;
	private targetAngle: number = 0;
	private rotating: boolean = false;

	constructor(private readonly turnTime: number, public angle: number) {
		this.step = NINETY_DEGREES / turnTime;
	}

	get isRotating(): boolean {
		return this.rotating;
	}

	beginTurnExecution(turnDirection: Directions): void {
		this.startAngle = this.angle;

		if (turnDirection === Directions.LEFT) {
			this.targetAngle = normalizeAngle(this.startAngle + NINETY_DEGREES);
			this.step = Math.abs(this.step);
		} else if (turnDirection === Directions.RIGHT) {
			this.targetAngle = normalizeAngle(this.startAngle - NINETY_DEGREES);
			this.step = -Math.abs(this.step);
		} else {
			throw new Error("Unknown turn direction");
		}

		this.frameCount = 0;
		this.rotating = true;
	}

	adjust(): void {
		if (!this.rotating) return;

		this.frameCount++;
		this.angle = normalizeAngle(this.angle + this.step);

		if (this.frameCount >= this.turnTime) {
			this.angle = this.targetAngle; // snap to precise final angle
			this.rotating = false;
		}
	}
}
export { Camera };
