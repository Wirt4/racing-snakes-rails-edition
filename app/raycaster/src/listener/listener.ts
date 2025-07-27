import { Directions } from '../controls/directions';
import { KeyMapInterface } from '../controls/keymap/interface';
import { DirectionMessengerInterface } from '../directionMessenger/interface';

interface ListenerInterface {
	keydown(keystroke: string): void;
	keyup(keystroke: string): void;
}

class Listener implements ListenerInterface {
	private lastDirection: Directions = Directions.NONE;

	constructor(
		private keyMap: KeyMapInterface,
		private directionMessenger: DirectionMessengerInterface
	) { }

	keydown(keystroke: string): void {
		if (this.keyMap.isMappedKey(keystroke)) {
			this.handleMappedKey(keystroke);
		}
	}

	keyup(keystroke: string): void {
		if (this.isReleasingPreviousDirection(keystroke)) {
			this.lastDirection = Directions.NONE;
		}
	}

	private handleMappedKey(keystroke: string): void {
		const direction = this.keyMap.toDirection(keystroke)
		this.postIfDirectionChanged(direction);
		this.lastDirection = direction;
	}

	private isReleasingPreviousDirection(keystroke: string): boolean {
		if (this.keyMap.isMappedKey(keystroke)) {
			return this.lastDirection === this.keyMap.toDirection(keystroke);
		}
		return false;
	}

	private postIfDirectionChanged(direction: Directions): void {
		if (direction !== this.lastDirection) {
			this.directionMessenger.sendTurn(direction);
		}
	}
}

export { Listener, ListenerInterface };
