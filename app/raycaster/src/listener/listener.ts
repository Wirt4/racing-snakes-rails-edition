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

	/**
	 * Derives the direction based on the click location 
	 * and posts it to the worker.
	 */
	click(x: number, windowWidth: number) {

		assertIsPositiveInteger(x);
		assertIsPositiveInteger(windowWidth);
		if (x > windowWidth) {
			throw new Error('x coordinate may not be wider than window width')
		}
		// if x is less than the halfway mark, it's a left turn, otherwise it's a right turn
		if (x < Math.floor(windowWidth / 2)) {
			this.postTurn(DirectionRecord.LEFT)
		} else {
			this.postTurn(DirectionRecord.RIGHT)
		}
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
			this.postTurn(direction)
		}
	}

	/**
	 * encapsulates a post for a turn direction
	 */
	private postTurn(direction: DirectionRecord) {
		//assert direction is valid type
		if (!Object.values(DirectionRecord).includes(direction as DirectionRecord)) {
			throw new Error(`${direction} is invalid`)
		}
		// exit early if no direction
		if (direction === DirectionRecord.NONE) {
			return;
		}
		//call worker with type "turn" and appropriate direction
		this.worker.postMessage({ type: 'turn', direction });
	}
}

export { Listener }
