import { Directions } from '../controls/directions';
import { NINETY_DEGREES } from '../geometry/constants';

class Camera {
	private frameCount: number;

	constructor(private readonly turnTime: number, public angle: number) {
		this.frameCount = this.turnTime;
	}

	get isRotating(): boolean {
		return this.frameCount < this.turnTime;
	}

	beginTurnExecution(turnDirection: Directions): void {
		this.frameCount = 0;
		this.angle = NINETY_DEGREES
	}

	adjust(): void {
		this.frameCount++;
	}
}
export { Camera }
