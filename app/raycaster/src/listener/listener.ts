import { Directions } from '../controls/directions';

const type = "turn";

enum LastDirection {
	LEFT = Directions.LEFT,
	RIGHT = Directions.RIGHT,
	NONE = "none"
}

class Listener {
	private lastDirection: LastDirection = LastDirection.NONE;
	constructor(private worker: Worker) { }

	keydown(keystroke: string): void {
		const direction = keystroke === "ArrowLeft" ? LastDirection.LEFT : LastDirection.RIGHT;
		this.postIfDirectionChanged(direction);
		this.lastDirection = direction;
	}

	private postIfDirectionChanged(direction: LastDirection): void {
		if (direction !== this.lastDirection) {
			this.worker.postMessage({ type, direction });
		}
	}
}

export { Listener }
