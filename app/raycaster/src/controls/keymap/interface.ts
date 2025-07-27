import { Directions } from '../directions';

interface KeyMapInterface {
	isMappedKey(key: string): boolean;
	toDirection(key: string): Directions;
}

export { KeyMapInterface };
