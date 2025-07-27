import { KeyMapInterface } from './interface';
import { Directions } from '../directions';

class KeyMap implements KeyMapInterface {
	constructor(private keyname: string) {
	}
	isMappedKey(key: string): boolean {
		return key === this.keyname;
	}

	toDirection(key: string): Directions {
		return Directions.NONE;
	}
}

export { KeyMap };
