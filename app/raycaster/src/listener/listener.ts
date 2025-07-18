import { Directions } from '../controls/directions';

const type = "turn";

enum DirectionRecord {
	LEFT = Directions.LEFT,
	RIGHT = Directions.RIGHT,
	NONE = "none"
}

class Listener {
	private lastDirection: DirectionRecord = DirectionRecord.NONE;
	private leftKey = "ArrowLeft";
	private rightKey = "ArrowRight";
	constructor(private worker: Worker) { }

	keydown(keystroke: string): void {
		if (!this.isValidKey(keystroke)) {
			return;
		}
		this.handleValidKey(keystroke);
	}

	keyup(keystroke: string): void {
		if (!this.isValidKey(keystroke)) {
			return;
		}

		const direction = keystroke === this.leftKey ? DirectionRecord.LEFT : DirectionRecord.RIGHT;
		this.lastDirection = this.lastDirection === direction ? DirectionRecord.NONE : this.lastDirection;
	}

	private isValidKey(keystroke: string): boolean {
		return keystroke === this.leftKey || keystroke === this.rightKey;
	}

	private handleValidKey(keystroke: string): void {
		const direction = keystroke === this.leftKey ? DirectionRecord.LEFT : DirectionRecord.RIGHT;
		this.postIfDirectionChanged(direction);
		this.lastDirection = direction;
	}

	private postIfDirectionChanged(direction: DirectionRecord): void {
		if (direction !== this.lastDirection) {
			this.worker.postMessage({ type, direction });
		}
	}
}

export { Listener }
