import { Directions } from '../controls/directions';
import { assertIsPositiveInteger } from '../utils/utils'

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
		if (!(this.isValidKey(keystroke) && this.isLastDirection(keystroke))) {
			return;
		}
		this.lastDirection = DirectionRecord.NONE;
	}
	/**derives the direction based on the click location 
	 * and posts it to the worker
	* */

	// click 
	click(x: number, windowWidth: number) {
		// hides: 
		// -- how the turn direction is derived from the click location
		// takes in the coordinates of the mouse click
		// information hidden
		// preconditions:
		// the game space is centered in the window
		// 		// x and windowWidth are positive integers

		assertIsPositiveInteger(x);
		assertIsPositiveInteger(windowWidth);
		if (x > windowWidth) {
			throw new Error('x coordinate may not be wider than window width')
		}
		// postconditions:
		//		the worker receives a directional message
	}

	private isLastDirection(keystroke: string): boolean {
		return this.lastDirection === this.keystrokeToDirection(keystroke);
	}

	private keystrokeToDirection(keystroke: string): DirectionRecord {
		return this.leftKey === keystroke ? DirectionRecord.LEFT : DirectionRecord.RIGHT;
	}

	private isValidKey(keystroke: string): boolean {
		return keystroke === this.leftKey || keystroke === this.rightKey;
	}

	private handleValidKey(keystroke: string): void {
		const direction = this.keystrokeToDirection(keystroke);
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
