import { Directions } from '../controls/directions';
import { KeyMapInterface } from '../controls/keymap/interface';
const type = "turn";


interface ListenerInterface {
	keydown(keystroke: string): void;
	keyup(keystroke: string): void;
}

class Listener implements ListenerInterface {
	private lastDirection: Directions = Directions.NONE;
	private leftKey = "ArrowLeft";
	constructor(private worker: Worker, private keyMap: KeyMapInterface) { }

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
		this.lastDirection = Directions.NONE;
	}

	private isLastDirection(keystroke: string): boolean {
		return this.lastDirection === this.keyMap.toDirection(keystroke);
	}

	private keystrokeToDirection(keystroke: string): Directions {
		return this.leftKey === keystroke ? Directions.LEFT : Directions.RIGHT;
	}

	private isValidKey(keystroke: string): boolean {
		return this.keyMap.isMappedKey(keystroke);
	}

	private handleValidKey(keystroke: string): void {
		const direction = this.keyMap.toDirection(keystroke)
		this.postIfDirectionChanged(direction);
		this.lastDirection = direction;
	}

	private postIfDirectionChanged(direction: Directions): void {
		if (direction !== this.lastDirection) {
			this.worker.postMessage({ type, direction });
		}
	}
}

export { Listener, ListenerInterface };
