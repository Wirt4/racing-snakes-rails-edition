import { Directions } from '../controls/directions';
class Camera {
	private frameCount: number;

	constructor(private readonly turnTime: number) {
		this.frameCount = this.turnTime;
	}

	get isRotating(): boolean {
		return this.frameCount < this.turnTime;
	}

	beginTurnExecution(turnDirection: Directions): void {
		this.frameCount = 0;
	}

	adjust(): void {
		this.frameCount++;
	}
}
export { Camera }
