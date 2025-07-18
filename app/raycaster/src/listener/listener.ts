import { Directions } from '../controls/directions';

const type = "turn";

enum LastDirection {
	LEFT = Directions.LEFT,
	RIGHT = Directions.RIGHT,
	NONE = "none"
}

class Listener {
	private lastDirection: LastDirection = LastDirection.NONE;
	private leftKey = "ArrowLeft";
	private rightKey = "ArrowRight";
	constructor(private worker: Worker) { }

	keydown(keystroke: string): void {
		if (!this.isValidKey(keystroke)) {
			return;
		}
		this.postIfDirectionChanged(keystroke);
	}

	private isValidKey(keystroke: string): boolean {
		return keystroke === this.leftKey || keystroke === this.rightKey;
	}

	private postIfDirectionChanged(keystroke: string): void {
		const direction = keystroke === this.leftKey ? LastDirection.LEFT : LastDirection.RIGHT;
		if (direction !== this.lastDirection) {
			this.worker.postMessage({ type, direction });
		}
		this.lastDirection = direction;

	}
}

export { Listener }
