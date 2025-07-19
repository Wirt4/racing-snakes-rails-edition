
import { Directions } from '../controls/directions';
import { NINETY_DEGREES } from '../geometry/constants';
import { normalizeAngle } from '../utils/utils';
import { CameraInterface } from './interface';

class Camera implements CameraInterface {
	private frameCount: number = 0;
	private step: number = 0;
	private startAngle: number = 0;
	private targetAngle: number = 0;
	private rotating: boolean = false;
	private currentTurnDirection: Directions | null = null;

	constructor(private readonly turnTime: number, public angle: number) {
		this.step = NINETY_DEGREES / turnTime;
	}

	get isRotating(): boolean {
		return this.rotating;
	}

	beginTurnExecution(turnDirection: Directions): void {
		this.currentTurnDirection = turnDirection;
		this.startAngle = this.angle;
		this.setTargetAngleAndStep();
		this.frameCount = 0;
		this.rotating = true;
	}

	adjust(): void {
		if (!this.rotating) {
			return;
		}
		this.incrementAngle();
		this.snapToPrecision();
	}

	private incrementAngle() {
		this.frameCount++;
		this.angle = normalizeAngle(this.angle + this.step);
	}

	private snapToPrecision() {
		if (this.frameCount >= this.turnTime) {
			this.angle = this.targetAngle;
			this.rotating = false;
		}
	}

	private setTargetAngleAndStep(): void {
		const sign = this.currentTurnDirection === Directions.LEFT ? 1 : -1;
		this.initializeTargetAngleAndStep(sign);
	}

	private initializeTargetAngleAndStep(sign: number): void {
		this.targetAngle = normalizeAngle(this.startAngle + (sign * NINETY_DEGREES));
		this.step = sign * (this.step);
	}
}
export { Camera };
