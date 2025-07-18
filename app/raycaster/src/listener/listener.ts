import { Directions } from '../controls/directions';

const type = "turn";

enum LastDirection {
	LEFT = Directions.LEFT,
	RIGHT = Directions.RIGHT,
	NONE = "none"
}

class Listener {
	private buttonPressed: boolean = false;
	private lastDirection: LastDirection = LastDirection.NONE;
	constructor(private worker: Worker) { }

	keydown(keystroke: string): void {
		const direction = keystroke === "ArrowLeft" ? LastDirection.LEFT : LastDirection.RIGHT;
		if (this.lastDirection !== direction) {
			this.worker.postMessage({ type, direction });
		}
		this.lastDirection = direction;
	}
}

export { Listener }
