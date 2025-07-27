import { KeyMapInterface } from './interface';
import { Directions } from '../directions';

class KeyMap implements KeyMapInterface {
	constructor(private keynames: Array<string>) {
	}

	isMappedKey(key: string): boolean {
		return this.keynames.includes(key);
	}

	toDirection(key: string): Directions {
		return Directions.NONE;
	}
}

export { KeyMap };
