import { KeyMapInterface } from './interface';
import { Directions } from '../directions';

class KeyMap implements KeyMapInterface {

	isMappedKey(key: string): boolean {
		return false;
	}

	toDirection(key: string): Directions {
		return Directions.NONE;
	}
}

export { KeyMap };
