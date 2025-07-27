import { Directions } from '../controls/directions';
import { KeyMapInterface } from '../controls/keymap/interface';
import { DirectionMessengerInterface } from '../directionMessenger/interface';
const type = "turn";

interface ListenerInterface {
	keydown(keystroke: string): void;
	keyup(keystroke: string): void;
}

class Listener implements ListenerInterface {
	private lastDirection: Directions = Directions.NONE;
	constructor(
		private worker: Worker,
		private keyMap: KeyMapInterface,
		private directionMessenger: DirectionMessengerInterface
	) { }

	keydown(keystroke: string): void {
		if (!this.keyMap.isMappedKey(keystroke)) {
			return;
		}
		this.handleValidKey(keystroke);
	}

	keyup(keystroke: string): void {
		if (!(this.keyMap.isMappedKey(keystroke) && this.isLastDirection(keystroke))) {
			return;
		}
		this.lastDirection = Directions.NONE;
	}

	private isLastDirection(keystroke: string): boolean {
		return this.lastDirection === this.keyMap.toDirection(keystroke);
	}

	private handleValidKey(keystroke: string): void {
		const direction = this.keyMap.toDirection(keystroke)
		this.postIfDirectionChanged(direction);
		this.lastDirection = direction;
	}

	private postIfDirectionChanged(direction: Directions): void {
		if (direction !== this.lastDirection) {
			this.worker.postMessage({ type, direction });
			this.directionMessenger.sendTurn(direction);
		}
	}
}

export { Listener, ListenerInterface };
