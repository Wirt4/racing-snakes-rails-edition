import { KeyMapInterface } from './interface';
import { Directions } from '../directions';

class KeyMap implements KeyMapInterface {
	// index 0 is left, index 1 is right
	constructor(private keynames: Array<string> = ['ArrowLeft', 'ArrowRight']) {
		if (this.keynames.length !== 2) {
			throw new Error('KeyMap must have exactly two keys defined');
		}
		if (this.keynames[0] === this.keynames[1]) {
			throw new Error('KeyMap keys must be unique');
		}
		this.keynames = this.keynames.map(key => key.toLowerCase());
	}

	isMappedKey(key: string): boolean {
		return this.keynames.includes(key.toLowerCase());
	}

	toDirection(key: string): Directions {
		debugger;
		return this.keynames.indexOf(key) === 0 ? Directions.LEFT : Directions.RIGHT;
	}
}

export { KeyMap };
